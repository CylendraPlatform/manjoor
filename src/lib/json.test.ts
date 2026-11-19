import { describe, it, expect } from "vitest";
import { asJsonRecord, asString, asNumber, asBoolean } from "./json";

describe("Supabase Json narrowing helpers", () => {
  describe("asJsonRecord", () => {
    it("returns the object for a plain record", () => {
      expect(asJsonRecord({ a: 1 })).toEqual({ a: 1 });
    });
    it("returns {} for null, arrays and primitives", () => {
      expect(asJsonRecord(null)).toEqual({});
      expect(asJsonRecord(undefined)).toEqual({});
      expect(asJsonRecord([1, 2])).toEqual({});
      expect(asJsonRecord("x")).toEqual({});
      expect(asJsonRecord(5)).toEqual({});
    });
  });

  describe("asString / asNumber / asBoolean", () => {
    it("returns matching primitives", () => {
      expect(asString("hello")).toBe("hello");
      expect(asNumber(42)).toBe(42);
      expect(asBoolean(true)).toBe(true);
    });
    it("falls back on type mismatch", () => {
      expect(asString(42)).toBe("");
      expect(asString(42, "n/a")).toBe("n/a");
      expect(asNumber("42")).toBe(0);
      expect(asNumber("42", -1)).toBe(-1);
      expect(asBoolean("true")).toBe(false);
      expect(asBoolean(1)).toBe(false);
    });
  });

  it("supports the coupon-validation access pattern", () => {
    const rpcResult = { valid: true, id: "c1", code: "SAVE10", discount_type: "percentage", value: 10 };
    const r = asJsonRecord(rpcResult);
    expect(asBoolean(r.valid)).toBe(true);
    expect(asString(r.code)).toBe("SAVE10");
    expect(asNumber(r.value)).toBe(10);
  });
});
