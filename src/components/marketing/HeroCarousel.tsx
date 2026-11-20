import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { useHeroChrome } from "@/components/marketing/hero-chrome-context";
import type { HeroSlide } from "@/content/hero";

const AUTOPLAY_MS = 8000;

// The owner's redesigned hero photos each carry a naturally dark negative-space
// region where the copy sits, so every slide uses one ivory-on-dark treatment —
// no cream/dark CSS scrim; contrast comes from the photography plus text-shadow.
const DARK_THEME = {
  copy: "hero-copy",
  kicker: "text-[#e6c07c] [text-shadow:0_1px_10px_rgba(0,0,0,0.6)]",
  title: "text-[#f7f0e5] [text-shadow:0_2px_18px_rgba(0,0,0,0.6),0_1px_3px_rgba(0,0,0,0.55)]",
  body: "text-[#f1e8da] [text-shadow:0_2px_14px_rgba(0,0,0,0.66),0_1px_2px_rgba(0,0,0,0.5)]",
  primary: "bg-[#d4af5a] text-white shadow-[0_10px_28px_rgba(184,137,70,0.55)] hover:bg-[#e0bc6a]",
  secondary: "border-[#efe6d8]/70 bg-black/25 text-[#f4ece0]",
  control: "border-white/20 bg-black/40 text-[#f4ece0]",
  dot: "bg-[#f4ece0]/50",
} as const;

const THEME = {
  production: DARK_THEME,
  craft: DARK_THEME,
  custom: DARK_THEME,
} as const;

export default function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const labelId = useId();
  const chrome = useHeroChrome();
  const reduced = useRef(false);
  const paused = useRef(false);
  const [index, setIndex] = useState(0);
  const [mobile, setMobile] = useState(false);
  const [firstPainted, setFirstPainted] = useState(false);
  const firstImageRef = useRef<HTMLImageElement | null>(null);
  const count = slides.length;
  const nextIndex = count > 1 ? (index + 1) % count : -1;

  useEffect(() => {
    if (firstImageRef.current?.complete) setFirstPainted(true);
  }, []);

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
    if (!firstPainted || count < 2 || reduced.current) return;
    const timer = window.setInterval(() => {
      if (!paused.current) go(index + 1);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [count, firstPainted, go, index]);

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
      className="relative min-h-[100svh] overflow-hidden bg-[#1a120c]"
      aria-roledescription="carousel"
      aria-labelledby={labelId}
      onMouseEnter={() => { paused.current = true; }}
      onMouseLeave={() => { paused.current = false; }}
      onFocus={() => { paused.current = true; }}
      onBlur={() => { paused.current = false; }}
    >
      <h2 id={labelId} className="sr-only">عروض منجور الرئيسية</h2>
      {slides.map((item, slideIndex) => {
        const active = slideIndex === index;
        const prefetch = firstPainted && slideIndex === nextIndex;
        if (!active && !prefetch) return null;
        return (
        <div
          key={item.id}
          className={`absolute inset-0 ${active ? "opacity-100" : "pointer-events-none opacity-0"} motion-reduce:transition-none transition-opacity duration-500`}
          aria-hidden={!active}
        >
          <picture>
            <source media="(max-width: 767px)" srcSet={item.imageMobile} type="image/webp" width={900} height={1600} />
            <img
              ref={slideIndex === 0 ? firstImageRef : undefined}
              src={item.image}
              alt=""
              width={item.imageWidth}
              height={item.imageHeight}
              sizes="100vw"
              decoding="async"
              loading={active || slideIndex === 0 ? "eager" : "lazy"}
              fetchPriority={active && slideIndex === 0 ? "high" : "low"}
              className="h-full w-full object-cover"
              style={{ objectPosition: mobile ? item.objectPositionMobile : item.objectPosition }}
              onLoad={() => {
                if (slideIndex === 0) setFirstPainted(true);
              }}
            />
          </picture>
        </div>
        );
      })}
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-6xl items-start px-4 pb-24 pt-28 md:items-center md:px-20 md:pt-32">
        <div className={`${theme.copy} space-y-4 md:space-y-5`}>
          <p className={`text-sm font-bold ${theme.kicker}`}>{slide.kicker}</p>
          <h1 className={`max-w-[18ch] text-[1.85rem] font-extrabold leading-[1.35] sm:text-4xl md:text-[2.85rem] md:leading-[1.3] ${theme.title}`}>
            {slide.title}
          </h1>
          <p className={`max-w-md text-base font-medium leading-8 md:text-[1.05rem] md:leading-9 ${theme.body}`}>
            {slide.body}
          </p>
          <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:gap-3">
            <Link
              to={slide.primary.href}
              className={`inline-flex min-h-11 items-center justify-center rounded-full px-7 py-3 text-center text-sm font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-manjoor-brass sm:min-w-[11rem] ${theme.primary}`}
              onClick={() => trackEvent("hero_cta_click", { slide: slide.id, cta: "primary" })}
            >
              {slide.primary.label}
            </Link>
            <Link
              to={slide.secondary.href}
              className={`inline-flex min-h-11 items-center justify-center rounded-full border px-7 py-3 text-center text-sm font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-manjoor-brass sm:min-w-[11rem] ${theme.secondary}`}
              onClick={() => trackEvent("hero_cta_click", { slide: slide.id, cta: "secondary" })}
            >
              {slide.secondary.label}
            </Link>
          </div>
        </div>
      </div>

      {count > 1 && (
        <>
          <button
            type="button"
            className={`absolute end-5 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border backdrop-blur-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-manjoor-brass md:inline-flex ${theme.control}`}
            aria-label="الشريحة التالية"
            onClick={() => { paused.current = true; go(index + 1); }}
          >
            <ChevronLeft />
          </button>
          <button
            type="button"
            className={`absolute start-5 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border backdrop-blur-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-manjoor-brass md:inline-flex ${theme.control}`}
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
                className={`h-2.5 rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-manjoor-brass ${slideIndex === index ? "w-8 bg-manjoor-brass" : `w-2.5 ${theme.dot}`}`}
                onClick={() => { paused.current = true; go(slideIndex); }}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
