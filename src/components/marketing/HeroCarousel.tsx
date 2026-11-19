import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { useHeroChrome } from "@/components/marketing/hero-chrome-context";
import type { HeroSlide } from "@/content/hero";

const AUTOPLAY_MS = 8000;

const THEME = {
  production: {
    overlay: "bg-gradient-to-l from-[#f4ece0] via-[#f4ece0]/80 to-transparent md:w-8/12",
    top: "bg-gradient-to-b from-[#f4ece0]/90 to-transparent",
    panel: "bg-[#f4ece0]/78 backdrop-blur-[2px]",
    kicker: "text-manjoor-brass",
    title: "text-manjoor-walnut",
    body: "text-manjoor-charcoal",
    caption: "text-manjoor-charcoal/70",
    primary: "bg-manjoor-walnut text-manjoor-sand",
    secondary: "border-manjoor-walnut/40 bg-white/70 text-manjoor-walnut",
    control: "bg-[#f7f1e8]/90 text-manjoor-walnut",
    dot: "bg-manjoor-walnut/30",
  },
  craft: {
    overlay: "bg-gradient-to-l from-black/90 via-black/70 to-transparent md:w-7/12",
    top: "bg-gradient-to-b from-black/70 to-transparent",
    panel: "bg-black/40 backdrop-blur-[2px]",
    kicker: "text-manjoor-brass",
    title: "text-manjoor-sand",
    body: "text-manjoor-sand",
    caption: "text-manjoor-sand/70",
    primary: "bg-manjoor-brass text-manjoor-charcoal",
    secondary: "border-manjoor-sand/50 bg-black/35 text-manjoor-sand",
    control: "bg-black/50 text-manjoor-sand",
    dot: "bg-manjoor-sand/35",
  },
  custom: {
    overlay: "bg-gradient-to-l from-[#fbf7f0] via-[#fbf7f0]/78 to-transparent md:w-7/12",
    top: "bg-gradient-to-b from-[#fbf7f0]/90 to-transparent",
    panel: "bg-[#fbf7f0]/78 backdrop-blur-[2px]",
    kicker: "text-manjoor-brass",
    title: "text-manjoor-walnut",
    body: "text-manjoor-charcoal",
    caption: "text-manjoor-charcoal/70",
    primary: "bg-manjoor-walnut text-manjoor-sand",
    secondary: "border-manjoor-walnut/40 bg-white/75 text-manjoor-walnut",
    control: "bg-white/90 text-manjoor-walnut",
    dot: "bg-manjoor-walnut/25",
  },
} as const;

export default function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const labelId = useId();
  const chrome = useHeroChrome();
  const reduced = useRef(false);
  const paused = useRef(false);
  const [index, setIndex] = useState(0);
  const [mobile, setMobile] = useState(false);
  const count = slides.length;

  useEffect(() => {
    reduced.current = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => setMobile(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
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

  useEffect(() => {
    const theme = slides[index]?.theme;
    if (theme) chrome?.setTheme(theme);
  }, [chrome, index, slides]);

  if (count === 0) return null;
  const slide = slides[index];
  const theme = THEME[slide.theme];

  return (
    <section
      className="relative min-h-[100svh] overflow-hidden"
      aria-roledescription="carousel"
      aria-labelledby={labelId}
      onMouseEnter={() => { paused.current = true; }}
      onMouseLeave={() => { paused.current = false; }}
      onFocus={() => { paused.current = true; }}
      onBlur={() => { paused.current = false; }}
    >
      <h2 id={labelId} className="sr-only">عروض منجور الرئيسية</h2>
      {slides.map((item, slideIndex) => (
        <div
          key={item.id}
          className={`absolute inset-0 ${slideIndex === index ? "opacity-100" : "pointer-events-none opacity-0"} motion-reduce:transition-none transition-opacity duration-700`}
          aria-hidden={slideIndex !== index}
        >
          <picture>
            <source media="(max-width: 767px)" srcSet={item.imageMobile} width={900} height={1600} />
            <img
              src={item.image}
              alt=""
              width={item.imageWidth}
              height={item.imageHeight}
              fetchPriority={slideIndex === 0 ? "high" : "low"}
              className="h-full w-full object-cover"
              style={{ objectPosition: mobile ? item.objectPositionMobile : item.objectPosition }}
            />
          </picture>
        </div>
      ))}
      <div className={`pointer-events-none absolute inset-y-0 start-0 w-full ${theme.overlay}`} />
      <div className={`pointer-events-none absolute inset-x-0 top-0 h-36 ${theme.top}`} />

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-6xl items-center px-4 pb-16 pt-28 md:px-8 md:pt-32">
        <div className={`max-w-lg space-y-5 rounded-[2rem] p-5 sm:p-8 ${theme.panel}`}>
          <p className={`text-sm font-bold ${theme.kicker}`}>{slide.kicker}</p>
          <h1 className={`text-3xl font-extrabold leading-[1.25] sm:text-4xl md:text-5xl ${theme.title}`}>
            {slide.title}
          </h1>
          <p className={`text-base leading-8 ${theme.body}`}>{slide.body}</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              to={slide.primary.href}
              className={`rounded-full px-6 py-3 text-center font-bold ${theme.primary}`}
              onClick={() => trackEvent("hero_cta_click", { slide: slide.id, cta: "primary" })}
            >
              {slide.primary.label}
            </Link>
            <Link
              to={slide.secondary.href}
              className={`rounded-full border px-6 py-3 text-center font-bold ${theme.secondary}`}
              onClick={() => trackEvent("hero_cta_click", { slide: slide.id, cta: "secondary" })}
            >
              {slide.secondary.label}
            </Link>
          </div>
          <p className={`text-xs leading-5 ${theme.caption}`}>{slide.caption}</p>
        </div>
      </div>

      {count > 1 && (
        <>
          <button
            type="button"
            className={`absolute end-4 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full md:inline-flex ${theme.control}`}
            aria-label="الشريحة التالية"
            onClick={() => { paused.current = true; go(index + 1); }}
          >
            <ChevronLeft />
          </button>
          <button
            type="button"
            className={`absolute start-4 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full md:inline-flex ${theme.control}`}
            aria-label="الشريحة السابقة"
            onClick={() => { paused.current = true; go(index - 1); }}
          >
            <ChevronRight />
          </button>
          <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2" role="tablist" aria-label="شرائح العرض">
            {slides.map((item, slideIndex) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={slideIndex === index}
                aria-label={`الشريحة ${slideIndex + 1}: ${item.title}`}
                className={`h-2.5 rounded-full ${slideIndex === index ? "w-8 bg-manjoor-brass" : `w-2.5 ${theme.dot}`}`}
                onClick={() => { paused.current = true; go(slideIndex); }}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
