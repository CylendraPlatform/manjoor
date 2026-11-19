import { describe, expect, it } from "vitest";
import { features } from "@/config/features";
import { INQUIRY_PATHS, publicHeroSlides, workshopPromoReady } from "./hero";

const REGULATED = /أراكيل|أركيل|اركيل|شيش|نرجيل|hookah|شيشة|بكار أراكيل/i;

describe("homepage hero slides", () => {
  it("publishes three conceptual stories and keeps real workshop promo off", () => {
    const slides = publicHeroSlides();
    expect(slides).toHaveLength(3);
    expect(slides.map((item) => item.id)).toEqual(["craftsmanship", "custom-woodwork", "decorative"]);
    expect(slides.every((item) => item.kind === "conceptual")).toBe(true);
    expect(new Set(slides.map((item) => item.image)).size).toBe(3);
    expect(features.workshopProductPromo).toBe(false);
    expect(workshopPromoReady()).toBe(false);
  });

  it("does not advertise regulated hookah merchandise in public hero copy", () => {
    const text = publicHeroSlides().map((item) => `${item.title} ${item.body} ${item.kicker}`).join(" ");
    expect(text).not.toMatch(REGULATED);
    expect(publicHeroSlides().every((item) => item.image.startsWith("/concepts/") && !item.image.includes("photo"))).toBe(true);
  });

  it("routes the three commercial actions to existing inquiry pages", () => {
    expect(INQUIRY_PATHS).toHaveLength(3);
    expect(INQUIRY_PATHS.map((item) => item.href).every((href) => href === "/custom-orders" || href === "/request-quote")).toBe(true);
    const slides = publicHeroSlides();
    expect(slides[0].primary.href).toBe("/custom-orders");
    expect(slides[1].primary.href).toBe("/custom-orders");
    expect(slides[1].secondary.href).toBe("/request-quote");
  });
});
