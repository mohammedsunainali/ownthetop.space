import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { allListings } from "@/mock";
import { useWorldStore } from "@/state/world-store";
import { ProfileDrawer } from "./ProfileDrawer";

vi.mock("@/mock",async importOriginal=>{
  const original=await importOriginal<typeof import("@/mock")>();
  return {...original,allListings:original.allListings.map((item,index)=>index===0?{...item,name:"A Deliberately Long Company Name for Profile Header Review"}:item)};
});

describe("floor profile dismissal",()=>{
  afterEach(()=>{cleanup();useWorldStore.setState({selectedListingId:null,profileVisible:true});});
  it.each([true,false])("keeps listing details and closes with Escape for hiring=%s",(hiring)=>{
    const listing=allListings.find(item=>item.towerId==="companies" && item.hiring===hiring)!;
    useWorldStore.setState({selectedListingId:null,profileVisible:true});
    render(<><button>Floor trigger</button><ProfileDrawer/></>);
    const trigger=screen.getByRole("button",{name:"Floor trigger"});trigger.focus();
    act(()=>useWorldStore.setState({selectedListingId:listing.id}));
    expect(screen.getByRole("heading",{name:listing.name})).toBeInTheDocument();
    expect(screen.getByText(`Rank #${listing.rank}`)).toBeInTheDocument();
    expect(screen.getByRole("link",{name:"Visit website ↗"})).toHaveAttribute("href",listing.url);
    expect(screen.getByRole("button",{name:"Copy floor link"})).toBeInTheDocument();
    expect(!!screen.queryByText("HIRING ACTIVELY")).toBe(hiring);
    const close=screen.getByRole("button",{name:"Close profile"});
    expect(close).toHaveClass("profile-close--floor");close.focus();fireEvent.keyDown(close,{key:"Escape"});
    expect(screen.queryByRole("button",{name:"Close profile"})).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});
