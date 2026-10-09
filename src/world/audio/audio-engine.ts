type Point = readonly [number, number, number];
export const audioShouldRun = (enabled: boolean, hidden: boolean) => enabled && !hidden;
export const audioVolume = (value: number) => Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0;

/** Original synthesized ambience: no third-party recordings, one opt-in context. */
class SkylineAudio {
  context: AudioContext | null = null;
  private master: GainNode | null = null;
  private loops: AudioBufferSourceNode[] = [];
  private nodes: AudioNode[] = [];
  private emitters = new Map<string, PannerNode>();
  private levels = new Map<string, GainNode>();
  private enabled = false;
  private volume = 0.35;
  private onVisibility = () => { void this.sync().catch(() => {}); };
  async enable(enabled: boolean): Promise<boolean> {
    if (!enabled && !this.context) return true;
    if (!this.context) { try { this.initialize(); } catch { this.dispose(); return false; } }
    this.enabled = enabled;
    try { await this.sync(); return true; } catch { this.enabled = false; return false; }
  }
  private initialize() {
    const context = new AudioContext(); this.context = context;
    const master = context.createGain(); master.gain.value = this.volume; master.connect(context.destination); this.master = master;
    let seed = 721;
    const buffer = context.createBuffer(1, context.sampleRate * 4, context.sampleRate), data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) { seed = (seed * 1664525 + 1013904223) >>> 0; data[i] = seed / 4294967296 * 2 - 1; }
    for (const [id, frequency, level, spatial] of [["wind", 260, 0.055, false], ["city", 100, 0.04, false], ["pool", 1300, 0.06, true], ["rotor", 170, 0.09, true]] as [string, number, number, boolean][]) {
      const source = context.createBufferSource(); source.buffer = buffer; source.loop = true;
      const filter = context.createBiquadFilter(); filter.type = "lowpass"; filter.frequency.value = frequency;
      const gain = context.createGain(); gain.gain.value = level;
      source.connect(filter); filter.connect(gain);
      if (spatial) {
        const panner = context.createPanner(); panner.panningModel = "HRTF"; panner.distanceModel = "inverse"; panner.refDistance = 5; panner.maxDistance = 140; panner.rolloffFactor = 1.5;
        gain.connect(panner); panner.connect(master); this.emitters.set(id, panner); this.nodes.push(panner);
      } else gain.connect(master);
      source.start(); this.loops.push(source); this.nodes.push(filter, gain); this.levels.set(id, gain);
    }
    document.addEventListener("visibilitychange", this.onVisibility);
  }
  private async sync() {
    const context = this.context;
    if (!context || context.state === "closed") return;
    if (audioShouldRun(this.enabled, document.hidden)) await context.resume(); else await context.suspend();
  }
  setVolume(value: number) { this.volume = audioVolume(value); if (this.master && this.context) this.master.gain.setTargetAtTime(this.volume, this.context.currentTime, 0.1); }
  update(listener: Point, forward: Point, up: Point, pool: Point, rotor: Point, idle: boolean, night: boolean) {
    const context = this.context; if (!context || context.state !== "running" || !this.enabled) return;
    const l = context.listener;
    l.positionX.value = listener[0]; l.positionY.value = listener[1]; l.positionZ.value = listener[2];
    l.forwardX.value = forward[0]; l.forwardY.value = forward[1]; l.forwardZ.value = forward[2];
    l.upX.value = up[0]; l.upY.value = up[1]; l.upZ.value = up[2];
    for (const [id, point] of [["pool", pool], ["rotor", rotor]] as [string, Point][]) {
      const panner = this.emitters.get(id)!; panner.positionX.value = point[0]; panner.positionY.value = point[1]; panner.positionZ.value = point[2];
    }
    this.levels.get("rotor")!.gain.setTargetAtTime(idle ? 0.025 : 0.09, context.currentTime, 0.15);
    this.levels.get("city")!.gain.setTargetAtTime(night ? 0.015 : 0.04, context.currentTime, 0.5);
  }
  cue(from = 460, to = 680, duration = 0.16) {
    const context = this.context; if (!context || context.state !== "running" || !this.enabled || !this.master) return;
    const tone = context.createOscillator(), gain = context.createGain(), now = context.currentTime;
    tone.frequency.setValueAtTime(from, now); tone.frequency.exponentialRampToValueAtTime(to, now + duration);
    gain.gain.setValueAtTime(0.0001, now); gain.gain.exponentialRampToValueAtTime(0.04, now + 0.015); gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    tone.connect(gain); gain.connect(this.master); tone.onended = () => { tone.disconnect(); gain.disconnect(); };
    tone.start(); tone.stop(now + duration + 0.02);
  }
  dispose() {
    if (typeof document !== "undefined") document.removeEventListener("visibilitychange", this.onVisibility);
    this.loops.forEach(source => { source.stop(); source.disconnect(); }); this.nodes.forEach(node => node.disconnect()); this.master?.disconnect();
    if (this.context && this.context.state !== "closed") void this.context.close(); this.context = null; this.master = null; this.loops = []; this.nodes = []; this.emitters.clear(); this.levels.clear(); this.enabled = false;
  }
}
export const skylineAudio = new SkylineAudio();
