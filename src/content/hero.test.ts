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

  it("keeps homepage spotlights to three distinct destinations without repeating every concept card", () => {
    expect(HOMEPAGE_SPOTLIGHTS).toHaveLength(3);
    const images = HOMEPAGE_SPOTLIGHTS.map((item) => item.image).filter((value): value is string => Boolean(value));
    expect(new Set(images).size).toBe(images.length);
    expect(images.every((image) => !image.startsWith("/photo/"))).toBe(true);
  });
});
