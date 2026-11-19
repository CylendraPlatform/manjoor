import { describe, it, expect } from "vitest";
import { getErrorMessage } from "./utils";

describe("getErrorMessage", () => {
  it("reads an Error instance message", () => {
    expect(getErrorMessage(new Error("boom"))).toBe("boom");
  });

  it("returns a string error as-is", () => {
    expect(getErrorMessage("plain")).toBe("plain");
  });

  it("reads a Supabase/PostgREST-style error object", () => {
    expect(getErrorMessage({ message: "RLS violation" })).toBe("RLS violation");
  });

  it("falls back for unknown shapes", () => {
    expect(getErrorMessage(null)).toBe("حدث خطأ غير متوقع");
    expect(getErrorMessage(123)).toBe("حدث خطأ غير متوقع");
    expect(getErrorMessage({ code: 42 })).toBe("حدث خطأ غير متوقع");
  });
});
