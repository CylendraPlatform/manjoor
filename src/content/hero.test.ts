import { describe, expect, it } from "vitest";
import { INQUIRY_PATHS, publicHeroSlides } from "./hero";

describe("homepage hero slides", () => {
  it("leads with real workshop bakarat then custom and wholesale", () => {
    const slides = publicHeroSlides();
    expect(slides.map((item) => item.id)).toEqual(["bakarat", "custom", "wholesale"]);
    expect(slides.every((item) => item.kind === "workshop")).toBe(true);
    expect(slides.every((item) => item.image.startsWith("/workshop/"))).toBe(true);
    expect(new Set(slides.map((item) => item.image)).size).toBe(3);
  });

  it("uses the specified commercial actions", () => {
    const slides = publicHeroSlides();
    expect(slides[0].primary).toEqual({ label: "استعرض البكّارات", href: "/products" });
    expect(slides[0].secondary).toEqual({ label: "اطلب عرض سعر", href: "/wholesale" });
    expect(slides[1].primary.href).toBe("/custom-orders");
    expect(slides[2].primary.href).toBe("/wholesale");
    expect(INQUIRY_PATHS.map((item) => item.href)).toEqual(["/products", "/custom-orders", "/wholesale"]);
  });
});
