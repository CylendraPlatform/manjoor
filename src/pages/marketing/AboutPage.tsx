import { Link } from "react-router-dom";
import Seo from "@/components/Seo";
import MarketingShell from "@/components/marketing/MarketingShell";
import { brand } from "@/config/brand";

const MOSAIC = [
  "/concepts/crops/candlesticks.jpg",
  "/concepts/crops/lamp-bases.jpg",
  "/concepts/crops/legs.jpg",
];

export default function AboutPage() {
  return (
    <MarketingShell>
      <Seo title="الورشة" description="منجور ورشة نجارة وخراطة في كربلاء. فنّ الخشب العراقي. التفاصيل غير الموثقة لا تُنشر." path="/about" />
      <div className="container grid gap-8 py-10 md:grid-cols-2 md:items-center">
        <div>
          <h1 className="text-4xl font-extrabold text-manjoor-walnut">{brand.ar}</h1>
          <p className="mt-2 text-manjoor-brass">{brand.sloganAr}</p>
          <p className="mt-4 leading-8">
            الورشة في كربلاء وتعمل في الخراطة والقطع الخشبية، وتتجه لعرض التحف والديكور والمكونات الخشبية للتجار.
            لا ننشر سنة التأسيس أو عدد العاملين أو شهادات أو أسماء عملاء قبل توثيقها.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link to="/contact" className="rounded-full bg-manjoor-walnut px-5 py-3 text-center font-bold text-manjoor-sand">تواصل مع الورشة</Link>
            <Link to="/custom-orders" className="rounded-full border border-manjoor-walnut px-5 py-3 text-center font-bold text-manjoor-walnut">استعرض أفكار التصنيع</Link>
          </div>
        </div>
        <figure>
          <div className="grid grid-cols-2 gap-3">
            <img src={MOSAIC[0]} alt="" className="col-span-2 aspect-[16/9] w-full rounded-3xl object-cover" width={900} height={506} />
            <img src={MOSAIC[1]} alt="" className="aspect-square w-full rounded-xl object-cover" width={450} height={450} />
            <img src={MOSAIC[2]} alt="" className="aspect-square w-full rounded-xl object-cover" width={450} height={450} />
          </div>
          <figcaption className="mt-3 text-xs leading-5 text-manjoor-charcoal/70">
            تصورات تصميمية من معرض الأفكار — ليست صوراً فوتوغرافية للورشة أو لمخزون جاهز.
          </figcaption>
        </figure>
      </div>
    </MarketingShell>
  );
}
