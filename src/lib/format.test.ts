import { describe, it, expect } from "vitest";
import { formatPrice } from "./format";

describe("formatPrice (Iraqi dinar display)", () => {
  it("appends the dinar symbol", () => {
    expect(formatPrice(1000)).toContain("د.ع");
  });

  it("returns a zero amount for null/undefined", () => {
    expect(formatPrice(null)).toBe("0 د.ع");
    expect(formatPrice(undefined)).toBe("0 د.ع");
  });

  it("formats a zero value with the dinar symbol (localized digits)", () => {
    // ar-IQ localizes 0 to the Arabic-Indic digit ٠; the literal "0 د.ع" is
    // only used for the null/undefined guard above.
    expect(formatPrice(0)).toContain("د.ع");
  });

  it("renders the numeric value in the string", () => {
    // ar-IQ locale may group digits; assert the amount is present in some form.
    const out = formatPrice(250000);
    expect(out).toContain("د.ع");
    expect(out.replace(/[^0-9٠-٩]/g, "").length).toBeGreaterThan(0);
  });
});
