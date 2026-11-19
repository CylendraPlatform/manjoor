import { describe, expect, it } from "vitest";
import { CAPABILITIES, publicHeroSlides } from "./hero";

describe("homepage hero slides", () => {
  it("uses three distinct editorial stories and assets", () => {
    const slides = publicHeroSlides();
    expect(slides.map((item) => item.id)).toEqual(["production", "craft", "custom"]);
    expect(slides.map((item) => item.kind)).toEqual(["workshop", "conceptual", "conceptual"]);
    expect(new Set(slides.map((item) => item.image)).size).toBe(3);
    expect(new Set(slides.map((item) => item.tone)).size).toBe(3);
    expect(slides[0].image).toContain("/workshop/hero/production");
    expect(slides[1].image).toContain("/workshop/hero/craft");
    expect(slides[2].image).toContain("/workshop/hero/custom");
  });

  it("routes the three capabilities without inventing checkout", () => {
    expect(CAPABILITIES.map((item) => item.href)).toEqual(["/products", "/about", "/custom-orders"]);
    const slides = publicHeroSlides();
    expect(slides[0].primary.href).toBe("/products");
    expect(slides[0].secondary.href).toBe("/wholesale");
    expect(slides[1].secondary.href).toBe("/custom-orders");
    expect(slides[2].primary.href).toBe("/custom-orders");
  });
});
