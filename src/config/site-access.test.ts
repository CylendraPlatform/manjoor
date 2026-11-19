import { describe, expect, it } from "vitest";
import { classifyPath, isSurfaceEnabled, MARKETING_EXACT_PATHS } from "./site-access";

describe("public route configuration", () => {
  it("keeps marketing routes distinct from checkout", () => {
    for (const path of ["/", "/products", "/wholesale", "/custom-orders", "/about", "/contact", "/request-quote", "/privacy"]) {
      expect(MARKETING_EXACT_PATHS).toContain(path);
      expect(classifyPath(path)).toBe("marketing");
    }
    expect(classifyPath("/checkout")).toBe("checkout");
    expect(classifyPath("/admin/leads")).toBe("admin");
    expect(isSurfaceEnabled("checkout", { publicSite: true, directCheckout: false })).toBe(false);
    expect(isSurfaceEnabled("marketing", { publicSite: false, directCheckout: false })).toBe(false);
  });
});
