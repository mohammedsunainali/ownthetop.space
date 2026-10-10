import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { CHECKOUT_DRAFT_KEY, DRAFT_LIFETIME_MS, readCheckoutDraft, saveCheckoutDraft } from "./draft-transfer";
import { CheckoutSummary } from "./CheckoutSummary";
import { validateCheckoutDraft, type CheckoutDraft } from "@/domain/checkout-draft";

const draft:CheckoutDraft={name:"Nova Labs",subtitle:"Trusted infrastructure",url:"example.com",towerId:"companies",category:"technology",hiring:true,logoUrl:"data:image/png;base64,cGl4ZWw=",amountMinor:10000,currency:"USD",estimatedRank:25};
describe("temporary checkout handoff",()=>{
  beforeEach(()=>sessionStorage.clear());
  afterEach(()=>{cleanup();vi.restoreAllMocks();});
  it("retains all details across repeated reads and uses stable snapshots",()=>{
    expect(saveCheckoutDraft(draft)).toBeNull();
    expect(readCheckoutDraft()).toEqual(draft);
    expect(readCheckoutDraft()).toBe(readCheckoutDraft());
    expect(JSON.parse(sessionStorage.getItem(CHECKOUT_DRAFT_KEY)!).draft).toEqual(draft);
  });
  it("expires the draft after 30 minutes and removes stale storage",()=>{
    saveCheckoutDraft(draft);
    vi.spyOn(Date,"now").mockReturnValue(Date.now()+DRAFT_LIFETIME_MS+1);
    expect(readCheckoutDraft()).toBeNull();
    expect(sessionStorage.getItem(CHECKOUT_DRAFT_KEY)).toBeNull();
  });
  it("handles missing and malformed drafts without fabricating a listing",()=>{
    expect(readCheckoutDraft()).toBeNull();
    sessionStorage.setItem(CHECKOUT_DRAFT_KEY,"broken");
    expect(readCheckoutDraft()).toBeNull();
    render(<CheckoutSummary/>);
    expect(screen.getByText("No available floor draft")).toBeInTheDocument();
    expect(screen.getByRole("link",{name:"Create your floor →"})).toHaveAttribute("href","/");
  });
  it("reports unavailable storage rather than navigating with an empty draft",()=>{
    vi.spyOn(Storage.prototype,"setItem").mockImplementation(()=>{throw new DOMException("Quota exceeded");});
    expect(saveCheckoutDraft(draft)).toMatch(/Your form has been kept/);
    expect(readCheckoutDraft()).toBeNull();
  });
  it("rejects invalid prices, currencies and unsafe logo or website content",()=>{
    for(const change of [{amountMinor:-1},{amountMinor:1.5},{currency:"EUR"},{estimatedRank:0},{logoUrl:"data:image/svg+xml;base64,abc="},{url:"javascript:alert(1)"},{towerId:"invalid"}]) expect(validateCheckoutDraft({...draft,...change})).toBe(false);
  });
  it("renders the complete unpaid summary with no payment form",()=>{
    saveCheckoutDraft(draft);
    const {container}=render(<CheckoutSummary/>);
    expect(screen.getByRole("heading",{name:draft.name})).toBeInTheDocument();
    for(const text of [draft.subtitle,draft.url,"Companies","technology","Hiring","#25"])expect(screen.getByText(text)).toBeInTheDocument();
    expect(screen.getByText(/Estimated ranking · not guaranteed/)).toBeInTheDocument();
    expect(screen.getByText(/No payment has been taken/)).toBeInTheDocument();
    expect(screen.getByAltText("Nova Labs logo preview")).toHaveAttribute("src",draft.logoUrl);
    expect(container.querySelector("form")).toBeNull();
    expect(screen.queryByRole("button",{name:/pay/i})).not.toBeInTheDocument();
  });
});
