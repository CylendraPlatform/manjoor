import { describe, expect, it } from "vitest";
import { CAPABILITIES, publicHeroSlides } from "./hero";

describe("homepage hero slides", () => {
  it("uses three fullscreen illustrative backgrounds", () => {
    const slides = publicHeroSlides();
    expect(slides.map((item) => item.id)).toEqual(["production", "craft", "custom"]);
    expect(slides.every((item) => item.kind === "conceptual")).toBe(true);
    expect(slides.map((item) => item.image)).toEqual([
      "/hero/production-desktop.webp",
      "/hero/craft-desktop.webp",
      "/hero/custom-desktop.webp",
    ]);
    expect(slides.map((item) => item.imageMobile)).toEqual([
      "/hero/production-mobile.webp",
      "/hero/craft-mobile.webp",
      "/hero/custom-mobile.webp",
    ]);
  });

  it("uses the specified headlines and inquiry routes", () => {
    const slides = publicHeroSlides();
    expect(slides[0].title).toBe("بكّارات خشبية من إنتاج منجور");
    expect(slides[0].primary).toEqual({ label: "استعرض البكّارات", href: "/products" });
    expect(slides[1].title).toBe("خراطة خشبية دقيقة وصناعة متقنة");
    expect(slides[1].primary).toEqual({ label: "تعرّف على الحرفة", href: "/about" });
    expect(slides[2].title).toBe("من فكرتك... نصنع قطعة مميزة");
    expect(slides[2].primary).toEqual({ label: "اطلب تصنيعاً خاصاً", href: "/custom-orders" });
    expect(CAPABILITIES.map((item) => item.href)).toEqual(["/products", "/about", "/custom-orders"]);
  });
});
