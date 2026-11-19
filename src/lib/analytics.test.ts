import { describe, it, expect, beforeEach } from "vitest";
import { captureAttribution, getAttribution, trackEvent, _getEventBuffer } from "./analytics";

beforeEach(() => { try { localStorage.clear(); } catch { /* ignore */ } });

describe("analytics", () => {
  it("captures UTM attribution once", () => {
    const a = captureAttribution("?utm_source=instagram&utm_medium=social&utm_campaign=wood", "/wholesale", "https://x");
    expect(a.utm_source).toBe("instagram");
    expect(a.landing_path).toBe("/wholesale");
    // second capture (different params) keeps the first-touch attribution
    const b = captureAttribution("?utm_source=google", "/", "");
    expect(b.utm_source).toBe("instagram");
  });
  it("records events with no PII in the buffer", () => {
    captureAttribution("", "/", "");
    trackEvent("add_to_quote", { product_id: "abc", quantity: 5 });
    const last = _getEventBuffer().at(-1)!;
    expect(last.event).toBe("add_to_quote");
    expect(JSON.stringify(last.props)).not.toMatch(/phone|name/i);
  });
});
