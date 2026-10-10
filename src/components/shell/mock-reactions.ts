import { skylineAudio } from "@/world/audio/audio-engine";
const PRESET_DOLLARS = [1, 2, 5, 10, 25, 50, 75, 100, 125, 150, 200, 250, 500, 1000, 2500, 5000, 10000];

export function nextMockAmount(currentMinor: number, direction: -1 | 1): number {
  const current = currentMinor / 100;
  const next = direction > 0 ? PRESET_DOLLARS.find((amount) => amount > current) : [...PRESET_DOLLARS].reverse().find((amount) => amount < current);
  return Math.round((next ?? Math.max(1, current + direction * 2500)) * 100);
}

export function mockReaction(amountMinor: number, topMinor: number): { copy: string; sound: "tiny" | "awkward" | "pop" | "build" | "tension" | "win" | "huge" } {
  if (amountMinor >= topMinor * 2) return { copy: "WHO GAVE THEM THE COMPANY CARD?", sound: "huge" };
  if (amountMinor > topMinor) return { copy: "WELCOME TO THE PENTHOUSE.", sound: "win" };
  if (amountMinor >= topMinor * 0.9) return { copy: "You're knocking on the penthouse.", sound: "tension" };
  if (amountMinor < 200) return { copy: "Bro… technically a floor.", sound: "tiny" };
  if (amountMinor < 1000) return { copy: "Basement energy.", sound: "awkward" };
  if (amountMinor < 5000) return { copy: "Okay. We see you.", sound: "pop" };
  return { copy: "Now we're building.", sound: "build" };
}

/** All cues are original, short procedural tones and only play after enabled user input. */
export function playMockReaction(sound: ReturnType<typeof mockReaction>["sound"]): void {
  const settings = {
    tiny: [330, 250, 0.12], awkward: [300, 120, 0.22], pop: [460, 680, 0.16],
    build: [220, 510, 0.24], tension: [350, 780, 0.3], win: [440, 920, 0.4], huge: [180, 760, 0.48],
  }[sound];
  const [from, to, duration] = settings;
  skylineAudio.cue(from, to, duration);
}
