import { Link } from "react-router-dom";
import Seo from "@/components/Seo";
import MarketingShell from "@/components/marketing/MarketingShell";
import WhatsAppCta from "@/components/WhatsAppCta";
import { brand } from "@/config/brand";

export default function ContactPage() {
  const phoneReady = brand.contact.phone.trim().length > 0;
  return (
    <MarketingShell>
      <Seo title="تواصل" description="تواصل مع ورشة منجور في كربلاء بخصوص المنتجات والجملة والتصنيع حسب الطلب." path="/contact" />
      <div className="container max-w-2xl py-12">
        <h1 className="text-3xl font-extrabold text-manjoor-walnut">تواصل معنا</h1>
        <p className="mt-3 leading-8">المكان: {brand.originAr}. العنوان التفصيلي لم يُعتمد بعد للنشر.</p>
        <p className="mt-3">{phoneReady ? `الهاتف: ${brand.contact.phone}` : "رقم الهاتف الرسمي لم يُضف في الإعدادات بعد، لذلك لا نعرض رقماً هنا."}</p>
        <div className="mt-6 flex flex-col gap-3">
          <WhatsAppCta topic="general" label="افتح واتساب" />
          <Link to="/request-quote" className="rounded-full bg-manjoor-walnut px-5 py-3 text-center font-bold text-manjoor-sand">اطلب عرض سعر</Link>
          <Link to="/wholesale" className="text-center font-bold text-manjoor-walnut underline">صفحة الجملة</Link>
        </div>
      </div>
    </MarketingShell>
  );
}
