import { useEffect, useState, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { brand } from "@/config/brand";
import { useQuoteStore } from "@/lib/quote-store";
import { captureAttribution, trackEvent } from "@/lib/analytics";
import BrandMark from "@/components/marketing/BrandMark";
import WhatsAppCta from "@/components/WhatsAppCta";
import { isWhatsAppConfigured } from "@/lib/whatsapp";
import { HeroChromeProvider } from "@/components/marketing/HeroChrome";
import { useHeroChrome } from "@/components/marketing/hero-chrome-context";

const LINKS = [
  { href: "/products", label: "البكّارات" },
  { href: "/wholesale", label: "الجملة" },
  { href: "/custom-orders", label: "تصنيع خاص" },
  { href: "/about", label: "الورشة" },
  { href: "/contact", label: "تواصل" },
];

function MarketingHeader() {
  const { pathname } = useLocation();
  const chrome = useHeroChrome();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const count = useQuoteStore((s) => s.itemCount());
  const overlayHome = Boolean(chrome?.overlay);
  const transparent = overlayHome && !scrolled;
  const craft = transparent && chrome?.theme === "craft";

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!overlayHome) {
      setScrolled(false);
      return;
    }
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [overlayHome]);

  const headerTone = overlayHome
    ? transparent
      ? craft
        ? "fixed border-transparent bg-gradient-to-b from-black/45 to-transparent text-[#f4ece0]"
        : "fixed border-transparent bg-gradient-to-b from-[rgba(250,246,239,0.58)] to-transparent text-manjoor-walnut"
      : "fixed border-manjoor-sand/80 bg-[#f7f1e8]/95 text-manjoor-walnut backdrop-blur"
    : "sticky border-manjoor-sand/80 bg-[#f7f1e8]/95 text-manjoor-walnut backdrop-blur";

  const ctaClass = craft
    ? "rounded-full bg-manjoor-brass px-4 py-2 text-sm font-bold text-manjoor-charcoal"
    : "rounded-full bg-manjoor-walnut px-4 py-2 text-sm font-bold text-manjoor-sand";

  return (
    <header className={`inset-x-0 top-0 z-50 border-b ${headerTone}`}>
      <div className="container flex h-16 items-center justify-between gap-3 sm:h-20 md:h-24">
        <Link to="/" aria-label="منجور الرئيسية" className={`min-w-0 shrink ${transparent ? "rounded-xl bg-[#f7f1e8]/90 px-2 py-1" : ""}`}>
          <BrandMark />
        </Link>
        <nav className={`hidden items-center gap-5 text-sm font-semibold lg:flex ${transparent ? (craft ? "rounded-full bg-black/35 px-4 py-2 backdrop-blur-md" : "rounded-full bg-[rgba(250,246,239,0.78)] px-4 py-2 text-[#3d2a1f] shadow-sm backdrop-blur-md") : ""}`}>
          {LINKS.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={pathname === link.href ? "font-bold" : craft ? "hover:text-manjoor-brass" : "hover:text-manjoor-walnut"}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/wholesale" className={ctaClass}>
            اطلب عرض سعر{count > 0 ? ` (${count})` : ""}
          </Link>
          <button
            type="button"
            className={`p-2 lg:hidden ${transparent ? (craft ? "rounded-lg bg-black/35" : "rounded-lg bg-[#f7f1e8]/85") : ""}`}
            aria-expanded={open}
            aria-label="القائمة"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {open && (
        <nav className={`flex flex-col gap-1 border-t px-4 py-3 lg:hidden ${craft ? "border-white/10 bg-manjoor-charcoal text-manjoor-sand" : "border-manjoor-sand bg-[#f7f1e8] text-manjoor-charcoal"}`}>
          {LINKS.map((link) => (
            <Link key={link.href} to={link.href} className="py-2 text-lg">{link.label}</Link>
          ))}
        </nav>
      )}
    </header>
  );
}

export default function MarketingShell({ children }: { children: ReactNode }) {
  const { pathname, search } = useLocation();

  useEffect(() => {
    captureAttribution(search, pathname, document.referrer);
    trackEvent("page_view", { path: pathname });
  }, [pathname, search]);

  return (
    <HeroChromeProvider overlay={pathname === "/"}>
      <div className="min-h-screen overflow-x-hidden bg-[#f7f1e8] text-manjoor-charcoal">
        <MarketingHeader />
        <main>{children}</main>
        <footer className="mt-16 border-t border-manjoor-sand bg-manjoor-charcoal text-manjoor-sand">
          <div className="container grid gap-6 py-10 md:grid-cols-3">
            <div>
              <div className="inline-block rounded-2xl bg-manjoor-sand p-2">
                <BrandMark variant="horizontal" className="h-14 md:h-16" />
              </div>
              <p className="mt-3 text-manjoor-brass">{brand.sloganAr}</p>
              <p className="mt-2 text-sm">{brand.originAr}</p>
            </div>
            <div className="flex flex-col gap-2 text-sm">
              {LINKS.map((link) => <Link key={link.href} to={link.href}>{link.label}</Link>)}
              <Link to="/privacy">الخصوصية</Link>
            </div>
            <p className="text-sm leading-7">
              إرسال استفسار لا يعني إتمام شراء ولا التزاماً بالتصنيع. الأسعار والتسليم تُؤكد بعد مراجعة الطلب.
              العنوان التفصيلي ورقم التواصل يُضيفان عند اعتمادها.
            </p>
          </div>
        </footer>
        {isWhatsAppConfigured() && (
          <div className="fixed bottom-4 left-4 z-40">
            <WhatsAppCta label="واتساب" />
          </div>
        )}
      </div>
    </HeroChromeProvider>
  );
}
