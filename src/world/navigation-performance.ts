/** Opt-in, bounded production diagnostics. Never writes React state. */
export const navigationSamples: Record<string, number[]> = {};
export function recordNavigationSample(kind: string, value: number) {
  if (typeof window === "undefined" || new URLSearchParams(window.location.search).get("diagnostics") !== "1") return;
  const samples = navigationSamples[kind] ??= [];
  if (samples.length === 512) samples.shift();
  samples.push(value);
}
export function timedNavigation<T>(kind: string, action: () => T): T {
  const start = performance.now();
  try { return action(); } finally { recordNavigationSample(kind, performance.now() - start); }
}
export function navigationSnapshot() {
  return Object.fromEntries(Object.entries(navigationSamples).map(([kind, values]) => {
    const sorted = [...values].sort((a, b) => a - b);
    const percentile = (p: number) => sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * p))] ?? 0;
    return [kind, { count: values.length, p50: percentile(.5), p95: percentile(.95), p99: percentile(.99), max: sorted.at(-1) ?? 0, total: values.reduce((a,b)=>a+b,0) }];
  }));
}
