import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import type { HeroSlide } from "@/content/hero";

const AUTOPLAY_MS = 7000;

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

  return (
    <section
      className="relative w-full overflow-hidden bg-[#efe6d8]"
      aria-roledescription="carousel"
      aria-labelledby={labelId}
      onMouseEnter={() => { paused.current = true; }}
      onMouseLeave={() => { paused.current = false; }}
      onFocus={() => { paused.current = true; }}
      onBlur={() => { paused.current = false; }}
    >
      <h2 id={labelId} className="sr-only">عروض منجور الرئيسية</h2>
      <div className="relative h-[min(68vh,34rem)] w-full">
        {slides.map((item, slideIndex) => (
          <div
            key={item.id}
            className={`absolute inset-0 transition-opacity duration-700 motion-reduce:transition-none ${slideIndex === index ? "opacity-100" : "pointer-events-none opacity-0"}`}
            aria-hidden={slideIndex !== index}
          >
            <img
              src={item.image}
              alt=""
              width={item.imageWidth}
              height={item.imageHeight}
              fetchpriority={slideIndex === 0 ? "high" : "low"}
              className="h-full w-full object-cover object-center"
              style={{ objectPosition: item.objectPosition }}
            />
          </div>
        ))}
        <div className="pointer-events-none absolute inset-y-0 start-0 w-full bg-gradient-to-l from-[#f7f1e8] via-[#f7f1e8]/55 to-transparent md:w-5/12" />

        <div className="relative z-10 mx-auto flex h-full max-w-6xl items-center px-4">
          <div className="max-w-lg space-y-4 rounded-3xl bg-[#f7f1e8]/80 p-5 backdrop-blur-sm md:bg-transparent md:p-0 md:backdrop-blur-none">
            <p className="text-sm font-bold text-manjoor-brass">{slide.kicker}</p>
            <h1 className="text-3xl font-extrabold leading-tight text-manjoor-walnut sm:text-4xl md:text-5xl">
              {slide.title}
            </h1>
            <p className="text-base leading-8 text-manjoor-charcoal/85">{slide.body}</p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                to={slide.primary.href}
                className="rounded-full bg-manjoor-walnut px-6 py-3 text-center font-bold text-manjoor-sand"
                onClick={() => trackEvent("hero_cta_click", { slide: slide.id, cta: "primary" })}
              >
                {slide.primary.label}
              </Link>
              <Link
                to={slide.secondary.href}
                className="rounded-full border border-manjoor-walnut px-6 py-3 text-center font-bold text-manjoor-walnut"
                onClick={() => trackEvent("hero_cta_click", { slide: slide.id, cta: "secondary" })}
              >
                {slide.secondary.label}
              </Link>
            </div>
            <p className="text-xs leading-5 text-manjoor-charcoal/60">{slide.caption}</p>
          </div>
        </div>
      </div>

      {count > 1 && (
        <>
          <button
            type="button"
            className="absolute end-3 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-manjoor-sand/90 text-manjoor-walnut md:inline-flex"
            aria-label="الشريحة التالية"
            onClick={() => { paused.current = true; go(index + 1); }}
          >
            <ChevronLeft />
          </button>
          <button
            type="button"
            className="absolute start-3 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-manjoor-sand/90 text-manjoor-walnut md:inline-flex"
            aria-label="الشريحة السابقة"
            onClick={() => { paused.current = true; go(index - 1); }}
          >
            <ChevronRight />
          </button>
          <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2" role="tablist" aria-label="شرائح العرض">
            {slides.map((item, slideIndex) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={slideIndex === index}
                aria-label={`الشريحة ${slideIndex + 1}: ${item.title}`}
                className={`h-2.5 rounded-full ${slideIndex === index ? "w-8 bg-manjoor-brass" : "w-2.5 bg-manjoor-sand/70"}`}
                onClick={() => { paused.current = true; go(slideIndex); }}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
