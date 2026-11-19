import { describe, expect, it } from "vitest";
import { claimSubmission, releaseSubmission, resetSubmissionGuard } from "./submission-guard";
import { validateReferenceImage } from "./uploads";

describe("duplicate submissions and image checks", () => {
  it("blocks a duplicate claim and allows a retry after release", () => {
    resetSubmissionGuard();
    expect(claimSubmission("a", 1000)).toBe("ok");
    expect(claimSubmission("a", 1500)).toBe("duplicate");
    releaseSubmission("a");
    expect(claimSubmission("a", 1600)).toBe("ok");
  });

  it("rejects non-image and oversized reference files", () => {
    expect(validateReferenceImage({ type: "image/gif", size: 100 })).toMatch(/JPG/);
    expect(validateReferenceImage({ type: "image/png", size: 5 * 1024 * 1024 })).toMatch(/4/);
    expect(validateReferenceImage({ type: "image/webp", size: 1024 })).toBeNull();
  });
});
