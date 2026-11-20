import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { useHeroChrome } from "@/components/marketing/hero-chrome-context";
import type { HeroSlide } from "@/content/hero";

const AUTOPLAY_MS = 8000;

const THEME = {
  production: {
    overlay: "bg-[linear-gradient(to_left,rgba(244,236,224,0.62)_0%,rgba(244,236,224,0.28)_38%,transparent_72%)]",
    top: "bg-gradient-to-b from-[#1a120c]/25 via-transparent to-transparent",
    kicker: "text-manjoor-brass",
    title: "text-manjoor-walnut [text-shadow:0_2px_18px_rgba(247,241,232,0.7)]",
    body: "text-manjoor-charcoal/90 [text-shadow:0_1px_12px_rgba(247,241,232,0.55)]",
    caption: "text-manjoor-charcoal/70",
    primary: "bg-manjoor-walnut text-manjoor-sand shadow-sm",
    secondary: "border-manjoor-walnut/35 bg-[#f7f1e8]/55 text-manjoor-walnut backdrop-blur-[2px]",
    control: "border-manjoor-walnut/15 bg-[#f7f1e8]/70 text-manjoor-walnut",
    dot: "bg-manjoor-walnut/35",
  },
  craft: {
    overlay: "bg-[linear-gradient(to_top,rgba(12,10,8,0.7)_0%,rgba(12,10,8,0.42)_40%,rgba(12,10,8,0.18)_68%,transparent_88%)] md:bg-[linear-gradient(to_left,rgba(12,10,8,0.72)_0%,rgba(12,10,8,0.38)_42%,transparent_78%)]",
    top: "bg-gradient-to-b from-black/45 via-black/10 to-transparent",
    kicker: "text-manjoor-brass",
    title: "text-manjoor-sand [text-shadow:0_8px_28px_rgba(0,0,0,0.55)]",
    body: "text-manjoor-sand [text-shadow:0_2px_10px_rgba(0,0,0,0.8),0_8px_24px_rgba(0,0,0,0.55)]",
    caption: "text-manjoor-sand/75",
    primary: "bg-manjoor-brass text-manjoor-charcoal shadow-sm",
    secondary: "border-manjoor-sand/40 bg-black/25 text-manjoor-sand backdrop-blur-[2px]",
    control: "border-white/15 bg-black/40 text-manjoor-sand",
    dot: "bg-manjoor-sand/40",
  },
  custom: {
    overlay: "bg-[linear-gradient(to_left,rgba(251,247,240,0.48)_0%,rgba(251,247,240,0.18)_36%,transparent_70%)]",
    top: "bg-gradient-to-b from-[#1a120c]/20 via-transparent to-transparent",
    kicker: "text-manjoor-brass",
    title: "text-manjoor-walnut [text-shadow:0_2px_16px_rgba(251,247,240,0.65)]",
    body: "text-manjoor-charcoal/90 [text-shadow:0_1px_10px_rgba(251,247,240,0.5)]",
    caption: "text-manjoor-charcoal/70",
    primary: "bg-manjoor-walnut text-manjoor-sand shadow-sm",
    secondary: "border-manjoor-walnut/35 bg-[#fbf7f0]/50 text-manjoor-walnut backdrop-blur-[2px]",
    control: "border-manjoor-walnut/15 bg-[#fbf7f0]/70 text-manjoor-walnut",
    dot: "bg-manjoor-walnut/30",
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
      <div className={`pointer-events-none absolute inset-0 ${theme.overlay}`} />
      <div className={`pointer-events-none absolute inset-x-0 top-0 h-28 md:h-36 ${theme.top}`} />

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-6xl items-center px-4 pb-20 pt-28 md:px-8 md:pt-32">
        <div className={`relative max-w-xl space-y-4 md:max-w-2xl md:space-y-6 ${slide.theme === "craft" ? "max-md:before:absolute max-md:before:-inset-6 max-md:before:-z-10 max-md:before:bg-[radial-gradient(ellipse_at_center,rgba(12,10,8,0.55),transparent_72%)]" : ""}`}>
          <p className={`text-xs font-bold tracking-[0.18em] sm:text-sm ${theme.kicker}`}>{slide.kicker}</p>
          <h1 className={`max-w-[16ch] text-[1.85rem] font-extrabold leading-[1.35] sm:text-4xl md:text-[3.15rem] md:leading-[1.28] ${theme.title}`}>
            {slide.title}
          </h1>
          <p className={`max-w-md text-base leading-8 md:text-lg md:leading-9 ${theme.body}`}>{slide.body}</p>
          <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:gap-4">
            <Link
              to={slide.primary.href}
              className={`rounded-full px-7 py-3.5 text-center text-sm font-bold sm:min-w-[11.5rem] ${theme.primary}`}
              onClick={() => trackEvent("hero_cta_click", { slide: slide.id, cta: "primary" })}
            >
              {slide.primary.label}
            </Link>
            <Link
              to={slide.secondary.href}
              className={`rounded-full border px-7 py-3.5 text-center text-sm font-bold sm:min-w-[11.5rem] ${theme.secondary}`}
              onClick={() => trackEvent("hero_cta_click", { slide: slide.id, cta: "secondary" })}
            >
              {slide.secondary.label}
            </Link>
          </div>
          <p className={`max-w-sm pt-1 text-[11px] leading-6 ${theme.caption}`}>{slide.caption}</p>
        </div>
      </div>

      {count > 1 && (
        <>
          <button
            type="button"
            className={`absolute end-5 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border backdrop-blur-sm md:inline-flex ${theme.control}`}
            aria-label="الشريحة التالية"
            onClick={() => { paused.current = true; go(index + 1); }}
          >
            <ChevronLeft />
          </button>
          <button
            type="button"
            className={`absolute start-5 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border backdrop-blur-sm md:inline-flex ${theme.control}`}
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
