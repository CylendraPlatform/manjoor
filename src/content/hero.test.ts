import { describe, expect, it } from "vitest";
import { features } from "@/config/features";
import { HOMEPAGE_SPOTLIGHTS, publicHeroSlides, workshopPromoReady } from "./hero";

const REGULATED = /أراكيل|أركيل|اركيل|شيش|نرجيل|hookah|شيشة|بكار أراكيل/i;

describe("homepage hero slides", () => {
  it("publishes two conceptual slides and keeps the workshop slide disabled", () => {
    const slides = publicHeroSlides();
    expect(slides).toHaveLength(2);
    expect(slides.map((item) => item.id)).toEqual(["craftsmanship", "custom-woodwork"]);
    expect(slides.every((item) => item.kind === "conceptual")).toBe(true);
    expect(features.workshopProductPromo).toBe(false);
    expect(workshopPromoReady()).toBe(false);
  });

  it("does not advertise regulated hookah merchandise in public hero copy", () => {
    const text = publicHeroSlides().map((item) => `${item.title} ${item.body} ${item.kicker}`).join(" ");
    expect(text).not.toMatch(REGULATED);
    expect(publicHeroSlides().every((item) => item.image.startsWith("/concepts/") && !item.image.includes("photo"))).toBe(true);
  });

  it("gives every spotlight a unique image that is not reused as a hero frame", () => {
    expect(HOMEPAGE_SPOTLIGHTS).toHaveLength(3);
    expect(HOMEPAGE_SPOTLIGHTS.every((item) => item.image.length > 0)).toBe(true);
    const spotlightImages = HOMEPAGE_SPOTLIGHTS.map((item) => item.image);
    expect(new Set(spotlightImages).size).toBe(3);
    const heroImages = publicHeroSlides().map((item) => item.image);
    expect(spotlightImages.some((image) => heroImages.includes(image))).toBe(false);
    expect(heroImages[0]).not.toBe(heroImages[1]);
  });
});
