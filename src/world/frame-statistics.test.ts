import { expect, it } from "vitest";
import { frameStatistics } from "./frame-statistics";
it("reports finite frame distributions without mutating the bounded source", () => {
  const samples = [33, 16, 17, 50, NaN];
  expect(frameStatistics(samples)).toEqual({ frameP50Ms: 17, frameP95Ms: 33, frameP99Ms: 33, frameMaxMs: 50 });
  expect(samples[0]).toBe(33); expect(frameStatistics([]).frameP50Ms).toBe(0);
});
