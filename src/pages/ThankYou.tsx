import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { storeConfig } from "@/config/store";

const ThankYou = () => {
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get("order") || "";

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-16 text-center">
        <div className="max-w-md mx-auto animate-fade-in">
          <CheckCircle className="mx-auto mb-6 text-green-500" size={80} />
          <h1 className="text-3xl font-bold mb-4">شكراً لك!</h1>
          <p className="text-muted-foreground mb-2">تم استلام طلبك بنجاح</p>
          {orderNumber && (
            <p className="text-lg font-bold mb-6">رقم الطلب: {orderNumber}</p>
          )}
          <p className="text-sm text-muted-foreground mb-8">
            سيتم التواصل معك قريباً لتأكيد الطلب والتوصيل
          </p>
          <div className="space-y-3">
            <Link to="/">
              <Button className="w-full">العودة للرئيسية</Button>
            </Link>
            <a href={`https://wa.me/${storeConfig.whatsapp}`} target="_blank" rel="noreferrer">
              <Button variant="outline" className="w-full mt-2">تواصل معنا عبر واتساب</Button>
            </a>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};


export default ThankYou;
