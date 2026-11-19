import { Link } from "react-router-dom";
import { storeConfig } from "@/config/store";
import { Facebook, Instagram, MessageCircle, MapPin, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground mt-16">
      <div className="container py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div
              className="flex items-center gap-3 mb-4"
              dir="rtl"
              role="group"
              aria-label={`${storeConfig.brand.ar} ${storeConfig.brand.en}`}
            >
              <img
                src="/brand/manjoor-icon.png"
                alt=""
                className="h-12 w-12 md:h-14 md:w-14 object-contain shrink-0 select-none"
                draggable={false}
              />
              <div className="flex flex-col items-start text-right min-w-0">
                <span className="text-xl md:text-2xl font-bold text-primary-foreground leading-tight">
                  {storeConfig.brand.ar}
                </span>
                <span className="text-sm md:text-base font-medium text-primary-foreground/95 tracking-wide mt-0.5">
                  {storeConfig.brand.en}
                </span>
              </div>
            </div>
            <p className="text-sm opacity-80">
              {storeConfig.name} - وجهتك المفضلة للتسوق أونلاين في العراق
            </p>
            <div className="flex gap-4 mt-6">
              <a href={storeConfig.social.facebook} target="_blank" rel="noreferrer" className="hover:text-muted-foreground transition-colors">
                <Facebook size={20} />
              </a>
              <a href={storeConfig.social.instagram} target="_blank" rel="noreferrer" className="hover:text-muted-foreground transition-colors">
                <Instagram size={20} />
              </a>
              <a href={storeConfig.social.tiktok} target="_blank" rel="noreferrer" className="hover:text-muted-foreground transition-colors flex items-center">
                <span className="font-bold text-lg">𝅘𝅥𝅮</span>
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-3">روابط سريعة</h3>
            <div className="space-y-2 text-sm opacity-80">
              <Link to="/" className="block hover:opacity-100">الرئيسية</Link>
              <Link to="/products" className="block hover:opacity-100">المنتجات</Link>
              <Link to="/privacy" className="block hover:opacity-100">سياسة الخصوصية</Link>
              <Link to="/support" className="block hover:opacity-100">الدعم والمساعدة</Link>
            </div>
          </div>
          <div>
            <h3 className="font-bold mb-3">تواصل معنا</h3>
            <div className="space-y-3 text-sm opacity-80">
              <a href={`https://wa.me/${storeConfig.whatsapp}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:opacity-100">
                <MessageCircle size={16} />
                <span className="flex items-center gap-1">
                  <span>واتساب:</span>
                  <span dir="ltr" className="inline-block">{storeConfig.phone}</span>
                </span>
              </a>
              <div className="flex items-center gap-2">
                <Phone size={16} />
                <span dir="ltr" className="inline-block">{storeConfig.phone}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin size={16} className="mt-1 flex-shrink-0" />
                <span className="text-right" style={{ unicodeBidi: 'plaintext' }}>{storeConfig.address}</span>
              </div>
            </div>

          </div>
        </div>
        <div className="border-t border-primary-foreground/20 mt-8 pt-6 text-center text-sm opacity-60">
          © {new Date().getFullYear()} {storeConfig.name} . جميع الحقوق محفوظة.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

