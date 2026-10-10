import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { CharacterSpeechBubble } from "./CharacterSpeechBubble";
const motion=vi.hoisted(()=>({reduced:false}));
vi.mock("@react-three/drei",()=>({Html:({children}:{children:ReactNode})=><>{children}</>}));
vi.mock("@react-three/fiber",()=>({useFrame:vi.fn()}));
vi.mock("@/hooks/use-reduced-motion",()=>({useReducedMotion:()=>motion.reduced}));
describe("mascot announcement timing",()=>{
  afterEach(()=>{cleanup();vi.useRealTimers();motion.reduced=false;});
  it("announces existing text without a close button and fades after 5.5 seconds",()=>{
    vi.useFakeTimers();const dismiss=vi.fn();
    const {container}=render(<CharacterSpeechBubble message="Your next launch deserves a skyline." onDismiss={dismiss} towerId="products" floorCount={14}/>);
    expect(screen.getByRole("status")).toHaveTextContent("Your next launch deserves a skyline.");
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    act(()=>vi.advanceTimersByTime(5499));expect(dismiss).not.toHaveBeenCalled();
    act(()=>vi.advanceTimersByTime(1));expect(container.querySelector(".character-speech--closing")).toBeInTheDocument();
    act(()=>vi.advanceTimersByTime(160));expect(dismiss).toHaveBeenCalledOnce();
  });
  it("dismisses without a fade delay in reduced motion and cleans up timers",()=>{
    vi.useFakeTimers();motion.reduced=true;const dismiss=vi.fn();
    const {unmount}=render(<CharacterSpeechBubble message="Got a product worth showing off?" onDismiss={dismiss} towerId="products" floorCount={14}/>);
    act(()=>vi.advanceTimersByTime(5500));act(()=>vi.advanceTimersByTime(1));expect(dismiss).toHaveBeenCalledOnce();
    unmount();expect(vi.getTimerCount()).toBe(0);
  });
});
