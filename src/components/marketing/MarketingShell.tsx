import { useEffect, useState, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { brand } from "@/config/brand";
import { useQuoteStore } from "@/lib/quote-store";
import { captureAttribution, trackEvent } from "@/lib/analytics";
import BrandMark from "@/components/marketing/BrandMark";
import WhatsAppCta from "@/components/WhatsAppCta";
import { isWhatsAppConfigured } from "@/lib/whatsapp";

const LINKS = [
  { href: "/products", label: "البكّارات" },
  { href: "/wholesale", label: "الجملة" },
  { href: "/custom-orders", label: "تصنيع خاص" },
  { href: "/about", label: "الورشة" },
  { href: "/contact", label: "تواصل" },
];

export default function MarketingShell({ children }: { children: ReactNode }) {
  const { pathname, search } = useLocation();
  const [open, setOpen] = useState(false);
  const count = useQuoteStore((s) => s.itemCount());

  useEffect(() => {
    captureAttribution(search, pathname, document.referrer);
    trackEvent("page_view", { path: pathname });
    setOpen(false);
  }, [pathname, search]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f7f1e8] text-manjoor-charcoal">
      <header className="sticky top-0 z-40 border-b border-manjoor-sand/80 bg-[#f7f1e8]/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between gap-3 sm:h-20 md:h-24">
          <Link to="/" aria-label="منجور الرئيسية" className="min-w-0 shrink">
            <BrandMark />
          </Link>
          <nav className="hidden items-center gap-5 text-sm font-medium lg:flex">
            {LINKS.map((link) => (
              <Link key={link.href} to={link.href} className={pathname === link.href ? "font-bold text-manjoor-walnut" : "hover:text-manjoor-walnut"}>
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/wholesale" className="rounded-full bg-manjoor-walnut px-4 py-2 text-sm font-bold text-manjoor-sand">
              اطلب عرض سعر{count > 0 ? ` (${count})` : ""}
            </Link>
            <button type="button" className="p-2 lg:hidden" aria-expanded={open} aria-label="القائمة" onClick={() => setOpen((v) => !v)}>
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        {open && (
          <nav className="flex flex-col gap-1 border-t border-manjoor-sand px-4 py-3 lg:hidden">
            {LINKS.map((link) => (
              <Link key={link.href} to={link.href} className="py-2 text-lg">{link.label}</Link>
            ))}
          </nav>
        )}
      </header>
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
  );
}
