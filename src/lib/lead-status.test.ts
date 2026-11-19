import { describe, expect, it } from "vitest";
import { canTransition, summarizeLeads } from "./lead-status";

describe("lead status", () => {
  it("moves new leads to contacted then qualified and blocks skipping to won", () => {
    expect(canTransition("new", "contacted")).toBe(true);
    expect(canTransition("contacted", "qualified")).toBe(true);
    expect(canTransition("new", "won")).toBe(false);
    expect(canTransition("won", "lost")).toBe(false);
  });

  it("summarizes only the rows it is given", () => {
    const summary = summarizeLeads([
      { status: "new", source: "wholesale", governorate: "كربلاء" },
      { status: "qualified", source: "quote_request", governorate: "النجف" },
    ]);
    expect(summary.uncontacted).toBe(1);
    expect(summary.pendingQuote).toBe(1);
    expect(summary.bySource.wholesale).toBe(1);
  });
});
