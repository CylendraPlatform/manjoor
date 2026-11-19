import { Link } from "react-router-dom";
import Seo from "@/components/Seo";
import MarketingShell from "@/components/marketing/MarketingShell";
import { brand } from "@/config/brand";

export default function PrivacyPage() {
  return (
    <MarketingShell>
      <Seo title="الخصوصية" description="كيف تتعامل منجور مع بيانات استفسارات الجملة والتصنيع. النص بانتظار مراجعة قانونية قبل الإطلاق." path="/privacy" />
      <article className="container max-w-3xl py-12 leading-8">
        <h1 className="text-3xl font-extrabold text-manjoor-walnut">الخصوصية ومعالجة البيانات</h1>
        <p className="mt-4 text-sm">هذه المسودة تشغيلية وليست مراجعة قانونية نهائية. لا تُفعَّل النماذج العامة قبل اعتماد النص.</p>
        <h2 className="mt-8 text-xl font-bold">ماذا نجمع</h2>
        <p>عند إرسال استفسار: الاسم، الهاتف، اسم النشاط إن ذُكر، المحافظة، والمدينة اختيارياً، والمنتجات أو المواصفات، والكمية، وملاحظة قصيرة. قد نحتفظ بمصدر الحملة ومسار الصفحة بدون وضع الاسم أو الهاتف داخل روابط التتبع.</p>
        <h2 className="mt-6 text-xl font-bold">لماذا</h2>
        <p>للرد على طلب العرض أو التصنيع ومتابعة البيع داخلياً. لا نستخدم البيانات لحملات آلية ولا نعرض أرقام الزبائن على الموقع.</p>
        <h2 className="mt-6 text-xl font-bold">من يطلع عليها</h2>
        <p>حسابات الإدارة في {brand.ar} فقط، عبر جداول غير مقروءة للزوار. فتح رابط واتساب لا يعني أننا استلمنا الرسالة.</p>
        <h2 className="mt-6 text-xl font-bold">الاحتفاظ</h2>
        <p>تُحفظ الاستفسارات للمدة اللازمة للمتابعة التجارية ثم تُراجع للحذف. المدة الدقيقة تُثبت في سياسة معتمدة قبل الإطلاق.</p>
        <h2 className="mt-6 text-xl font-bold">ما لا نعد به هنا</h2>
        <p>لا سياسة إرجاع ولا مدة توصيل في هذه الصفحة، لأن البيع المباشر غير مفعّل.</p>
        <p className="mt-6"><Link to="/contact" className="font-bold text-manjoor-walnut underline">صفحة التواصل</Link></p>
      </article>
    </MarketingShell>
  );
}
