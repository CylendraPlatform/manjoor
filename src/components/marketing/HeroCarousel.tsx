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
      className="relative w-full overflow-hidden bg-manjoor-walnut"
      aria-roledescription="carousel"
      aria-labelledby={labelId}
      onMouseEnter={() => { paused.current = true; }}
      onMouseLeave={() => { paused.current = false; }}
      onFocus={() => { paused.current = true; }}
      onBlur={() => { paused.current = false; }}
    >
      <h2 id={labelId} className="sr-only">عروض منجور الرئيسية</h2>
      <div className="relative min-h-[28rem] md:min-h-[34rem] lg:min-h-[38rem]">
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
              className="h-full w-full object-cover"
              style={{ objectPosition: item.objectPosition }}
            />
            <div className="absolute inset-0 bg-gradient-to-l from-manjoor-walnut via-manjoor-walnut/80 to-manjoor-walnut/10" />
          </div>
        ))}

        <div className="relative z-10 mx-auto flex min-h-[28rem] max-w-6xl flex-col justify-end gap-5 px-4 py-10 md:min-h-[34rem] md:justify-center md:py-16 lg:min-h-[38rem]">
          <p className="text-sm font-bold text-manjoor-brass">{slide.kicker}</p>
          <h1 className="max-w-xl text-3xl font-extrabold leading-tight text-manjoor-sand sm:text-4xl md:text-5xl">
            {slide.title}
          </h1>
          <p className="max-w-lg text-base leading-8 text-manjoor-sand/90">{slide.body}</p>
          {slide.chips.length > 0 && (
            <ul className="flex max-w-xl flex-wrap gap-2">
              {slide.chips.map((chip) => (
                <li key={chip} className="rounded-full border border-manjoor-sand/30 bg-manjoor-charcoal/30 px-3 py-1 text-xs font-bold text-manjoor-sand">
                  {chip}
                </li>
              ))}
            </ul>
          )}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              to={slide.primary.href}
              className="rounded-full bg-manjoor-brass px-6 py-3 text-center font-bold text-manjoor-charcoal"
              onClick={() => trackEvent("hero_cta_click", { slide: slide.id, cta: "primary" })}
            >
              {slide.primary.label}
            </Link>
            <Link
              to={slide.secondary.href}
              className="rounded-full border border-manjoor-sand px-6 py-3 text-center font-bold text-manjoor-sand"
              onClick={() => trackEvent("hero_cta_click", { slide: slide.id, cta: "secondary" })}
            >
              {slide.secondary.label}
            </Link>
          </div>
          <p className="text-xs text-manjoor-sand/70">{slide.caption}</p>
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
