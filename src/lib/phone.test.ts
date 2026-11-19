import { describe, it, expect } from "vitest";
import { isValidIraqiPhone, toIraqiE164 } from "./phone";

describe("Iraqi phone validation", () => {
  it("accepts local 07XXXXXXXXX", () => {
    expect(isValidIraqiPhone("07701234567")).toBe(true);
    expect(isValidIraqiPhone("0770 123 4567")).toBe(true);
  });
  it("accepts +964 / 00964 forms", () => {
    expect(isValidIraqiPhone("+9647701234567")).toBe(true);
    expect(isValidIraqiPhone("009647701234567")).toBe(true);
  });
  it("rejects invalid numbers", () => {
    expect(isValidIraqiPhone("12345")).toBe(false);
    expect(isValidIraqiPhone("0612345678")).toBe(false);
    expect(isValidIraqiPhone("")).toBe(false);
  });
  it("normalizes to E.164", () => {
    expect(toIraqiE164("07701234567")).toBe("+9647701234567");
    expect(toIraqiE164("bad")).toBeNull();
  });
});
