export function frameStatistics(samples: readonly number[]) {
  const sorted = samples.filter(value => value > 0 && Number.isFinite(value)).sort((a, b) => a - b);
  const percentile = (p: number) => sorted[Math.min(sorted.length - 1, Math.floor((sorted.length - 1) * p))] ?? 0;
  return { frameP50Ms: percentile(0.5), frameP95Ms: percentile(0.95), frameP99Ms: percentile(0.99), frameMaxMs: sorted.at(-1) ?? 0 };
}
