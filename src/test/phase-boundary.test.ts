import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("Phase 2 dependency boundary", () => {
  it("does not include Phase 3 services", () => {
    const manifest = JSON.parse(readFileSync(resolve(process.cwd(), "package.json"), "utf8")) as { dependencies?: Record<string, string>; devDependencies?: Record<string, string> };
    const names = Object.keys({ ...manifest.dependencies, ...manifest.devDependencies });
    for (const blocked of ["@supabase/supabase-js", "razorpay", "posthog-js", "@sentry/nextjs", "firebase", "prisma", "@prisma/client", "redis"]) {
      expect(names).not.toContain(blocked);
    }
  });
});
