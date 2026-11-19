import { Link } from "react-router-dom";
import { ShieldAlert, Factory } from "lucide-react";
import { features } from "@/config/features";

/** Deliberately makes no Supabase calls. */
export default function InternalOnly() {
  const salesLocked = features.publicSite && !features.directCheckout;
  return (
    <main dir="rtl" className="min-h-screen flex items-center justify-center bg-muted/30 p-6">
      <section className="w-full max-w-lg rounded-2xl bg-card border border-border p-8 text-center space-y-4">
        <Factory className="mx-auto text-primary" size={46} aria-hidden="true" />
        <h1 className="text-2xl font-bold">{salesLocked ? "الشراء المباشر غير مفعّل" : "منجور — نظام إدارة التصنيع"}</h1>
        <div className="flex justify-center items-center gap-2 text-muted-foreground"><ShieldAlert size={18} /><span>{salesLocked ? "الاستفسار متاح، والدفع ليس كذلك" : "نسخة داخلية قيد الإعداد"}</span></div>
        <p className="leading-7 text-muted-foreground">
          {salesLocked
            ? "هذه الصفحة تخص الطلب المدفوع. يمكن طلب عرض سعر من الموقع، ولا يُنشأ طلب شراء من هنا."
            : "واجهة الطلبات العامة والتسويق غير مفعّلة. هذه النسخة مخصصة لتنظيم التشغيل والاختبارات فقط."}
        </p>
        <Link className="inline-block rounded-lg bg-primary text-primary-foreground px-5 py-3" to={salesLocked ? "/request-quote" : "/admin/login"}>
          {salesLocked ? "اطلب عرض سعر" : "دخول الإدارة"}
        </Link>
      </section>
    </main>
  );
}
