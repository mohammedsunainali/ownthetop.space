import { expect, it, vi } from "vitest";
import { audioShouldRun, audioVolume, skylineAudio } from "./audio-engine";
it("never creates audio on initial render or a mute request", async () => {
  expect(skylineAudio.context).toBeNull(); expect(await skylineAudio.enable(false)).toBe(true); expect(skylineAudio.context).toBeNull();
});
it("suspends the opt-in contract while hidden and clamps volume", () => {
  expect(audioShouldRun(false, false)).toBe(false); expect(audioShouldRun(true, true)).toBe(false); expect(audioShouldRun(true, false)).toBe(true);
  expect(audioVolume(-1)).toBe(0); expect(audioVolume(2)).toBe(1); expect(audioVolume(NaN)).toBe(0);
});
it("reuses one context, suspends on hide/mute, and stops every loop on teardown", async () => {
  const stopped = vi.fn(), disconnected = vi.fn();
  const param = () => ({ value: 0, setTargetAtTime: vi.fn(), setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() });
  const node = () => ({ gain: param(), frequency: param(), positionX: param(), positionY: param(), positionZ: param(), connect: vi.fn(), disconnect: disconnected, start: vi.fn(), stop: stopped });
  class FakeContext {
    state = "suspended"; currentTime = 0; sampleRate = 20; destination = {};
    createGain = node; createBufferSource = node; createBiquadFilter = node; createPanner = node;
    createBuffer = () => ({ getChannelData: () => new Float32Array(80) });
    resume = vi.fn(async () => { this.state = "running"; });
    suspend = vi.fn(async () => { this.state = "suspended"; });
    close = vi.fn(async () => { this.state = "closed"; });
  }
  let hidden = false;
  const visibility = vi.spyOn(document, "hidden", "get").mockImplementation(() => hidden);
  vi.stubGlobal("AudioContext", FakeContext);
  try {
    expect(await skylineAudio.enable(true)).toBe(true);
    const context = skylineAudio.context;
    expect(context?.state).toBe("running");
    await skylineAudio.enable(false); expect(context?.state).toBe("suspended");
    await skylineAudio.enable(true); expect(skylineAudio.context).toBe(context);
    hidden = true; document.dispatchEvent(new Event("visibilitychange")); await Promise.resolve(); expect(context?.state).toBe("suspended");
    hidden = false; document.dispatchEvent(new Event("visibilitychange")); await Promise.resolve(); expect(context?.state).toBe("running");
    skylineAudio.dispose(); expect(stopped).toHaveBeenCalledTimes(4); expect(disconnected).toHaveBeenCalled(); expect(context?.state).toBe("closed"); expect(skylineAudio.context).toBeNull();
  } finally { skylineAudio.dispose(); visibility.mockRestore(); vi.unstubAllGlobals(); }
});
