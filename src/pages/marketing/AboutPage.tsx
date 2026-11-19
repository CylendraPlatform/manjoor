import { Link } from "react-router-dom";
import Seo from "@/components/Seo";
import MarketingShell from "@/components/marketing/MarketingShell";
import PlaceholderVisual from "@/components/marketing/PlaceholderVisual";
import { brand } from "@/config/brand";

export default function AboutPage() {
  return (
    <MarketingShell>
      <Seo title="الورشة" description="منجور ورشة نجارة وخراطة في كربلاء. فنّ الخشب العراقي. التفاصيل غير الموثقة لا تُنشر." path="/about" />
      <div className="container grid gap-8 py-12 md:grid-cols-2">
        <div>
          <h1 className="text-4xl font-extrabold text-manjoor-walnut">{brand.ar}</h1>
          <p className="mt-2 text-manjoor-brass">{brand.sloganAr}</p>
          <p className="mt-4 leading-8">
            الورشة في كربلاء وتعمل في الخراطة والقطع الخشبية، وتتجه لعرض التحف والديكور والمكونات الخشبية للتجار.
            لا ننشر سنة التأسيس أو عدد العاملين أو شهادات أو أسماء عملاء قبل توثيقها.
          </p>
          <Link to="/contact" className="mt-6 inline-block rounded-full bg-manjoor-walnut px-5 py-3 font-bold text-manjoor-sand">تواصل مع الورشة</Link>
        </div>
        <PlaceholderVisual label="بانتظار صورة معتمدة للورشة" className="min-h-72 rounded-3xl" />
      </div>
    </MarketingShell>
  );
}
