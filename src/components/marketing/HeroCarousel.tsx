import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import type { HeroSlide } from "@/content/hero";

const AUTOPLAY_MS = 8000;

const TONE: Record<HeroSlide["tone"], string> = {
  cream: "bg-[#f4ece0] text-manjoor-charcoal",
  charcoal: "bg-manjoor-charcoal text-manjoor-sand",
  linen: "bg-[#fbf7f0] text-manjoor-charcoal",
};

export default function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const labelId = useId();
  const reduced = useRef(false);
  const paused = useRef(false);
  const [index, setIndex] = useState(0);
  const count = slides.length;

  useEffect(() => {
    reduced.current = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  }, []);

  const go = useCallback((next: number) => {
    if (count === 0) return;
    setIndex(((next % count) + count) % count);
  }, [count]);

  useEffect(() => {
    if (count < 2 || reduced.current) return;
    const timer = window.setInterval(() => {
      if (!paused.current) go(index + 1);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [count, go, index]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const tag = event.target instanceof HTMLElement ? event.target.tagName : "";
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (event.key === "ArrowLeft") go(index + 1);
      if (event.key === "ArrowRight") go(index - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, index]);

  if (count === 0) return null;
  const slide = slides[index];
  const dark = slide.tone === "charcoal";

  return (
    <section
      className={`relative overflow-hidden ${TONE[slide.tone]}`}
      aria-roledescription="carousel"
      aria-labelledby={labelId}
      onMouseEnter={() => { paused.current = true; }}
      onMouseLeave={() => { paused.current = false; }}
      onFocus={() => { paused.current = true; }}
      onBlur={() => { paused.current = false; }}
    >
      <h2 id={labelId} className="sr-only">عروض منجور الرئيسية</h2>
      <div className="container grid items-center gap-8 py-8 md:grid-cols-2 md:gap-12 md:py-14">
        <div className="order-2 space-y-4 md:order-1">
          <p className="text-sm font-bold text-manjoor-brass">{slide.kicker}</p>
          <h1 className={`text-3xl font-extrabold leading-[1.25] sm:text-4xl md:text-5xl ${dark ? "text-manjoor-sand" : "text-manjoor-walnut"}`}>
            {slide.title}
          </h1>
          <p className={`max-w-md text-base leading-8 ${dark ? "text-manjoor-sand/85" : "text-manjoor-charcoal/85"}`}>
            {slide.body}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              to={slide.primary.href}
              className={`rounded-full px-6 py-3 text-center font-bold ${dark ? "bg-manjoor-brass text-manjoor-charcoal" : "bg-manjoor-walnut text-manjoor-sand"}`}
              onClick={() => trackEvent("hero_cta_click", { slide: slide.id, cta: "primary" })}
            >
              {slide.primary.label}
            </Link>
            <Link
              to={slide.secondary.href}
              className={`rounded-full border px-6 py-3 text-center font-bold ${dark ? "border-manjoor-sand text-manjoor-sand" : "border-manjoor-walnut text-manjoor-walnut"}`}
              onClick={() => trackEvent("hero_cta_click", { slide: slide.id, cta: "secondary" })}
            >
              {slide.secondary.label}
            </Link>
          </div>
          <p className={`text-xs leading-5 ${dark ? "text-manjoor-sand/55" : "text-manjoor-charcoal/55"}`}>{slide.caption}</p>
        </div>

        <div className="order-1 md:order-2">
          {slides.map((item, slideIndex) => (
            <div
              key={item.id}
              className={`mx-auto w-full max-w-md overflow-hidden rounded-[2rem] ${slideIndex === index ? "block" : "hidden"}`}
              aria-hidden={slideIndex !== index}
            >
              <picture>
                <source media="(max-width: 767px)" srcSet={item.imageMobile} />
                <img
                  src={item.image}
                  alt=""
                  width={item.imageWidth}
                  height={item.imageHeight}
                  fetchpriority={slideIndex === 0 ? "high" : "low"}
                  className="aspect-[3/4] h-auto max-h-[28rem] w-full object-cover md:max-h-[32rem]"
                />
              </picture>
            </div>
          ))}
        </div>
      </div>

      {count > 1 && (
        <div className="container flex items-center justify-between pb-6">
          <div className="flex gap-2" role="tablist" aria-label="شرائح العرض">
            {slides.map((item, slideIndex) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={slideIndex === index}
                aria-label={`الشريحة ${slideIndex + 1}: ${item.title}`}
                className={`h-2.5 rounded-full ${slideIndex === index ? "w-8 bg-manjoor-brass" : dark ? "w-2.5 bg-manjoor-sand/40" : "w-2.5 bg-manjoor-walnut/25"}`}
                onClick={() => { paused.current = true; go(slideIndex); }}
              />
            ))}
          </div>
          <div className="hidden gap-2 md:flex">
            <button
              type="button"
              className={`inline-flex h-11 w-11 items-center justify-center rounded-full ${dark ? "bg-manjoor-sand/15 text-manjoor-sand" : "bg-white text-manjoor-walnut"}`}
              aria-label="الشريحة السابقة"
              onClick={() => { paused.current = true; go(index - 1); }}
            >
              <ChevronRight />
            </button>
            <button
              type="button"
              className={`inline-flex h-11 w-11 items-center justify-center rounded-full ${dark ? "bg-manjoor-sand/15 text-manjoor-sand" : "bg-white text-manjoor-walnut"}`}
              aria-label="الشريحة التالية"
              onClick={() => { paused.current = true; go(index + 1); }}
            >
              <ChevronLeft />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
