import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Package, Search, Truck, CheckCircle2, Clock, XCircle, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/lib/format";
import { toast } from "sonner";
import { format } from "date-fns";
import { arSA } from "date-fns/locale";
import { storeConfig } from "@/config/store";
import { asJsonRecord, asString, asNumber, asBoolean } from "@/lib/json";

type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

interface TrackedOrder {
    status: OrderStatus;
    order_number: string;
    created_at: string;
    total: number;
    delivery_company: string;
}

const TrackOrder = () => {
    const [orderNumber, setOrderNumber] = useState("");
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);
    const [orderData, setOrderData] = useState<TrackedOrder | null>(null);
    const [error, setError] = useState("");

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setOrderData(null);

        if (!orderNumber.trim() || !phone.trim()) {
            toast.error("يرجى إدخال رقم الطلب ورقم الهاتف");
            return;
        }

        setLoading(true);
        try {
            const { data, error } = await supabase.rpc('get_order_status', {
                p_order_number: orderNumber.trim(),
                p_phone: phone.trim()
            });

            if (error) throw error;

            const result = asJsonRecord(data);
            if (asBoolean(result.found)) {
                setOrderData({
                    status: asString(result.status) as OrderStatus,
                    order_number: asString(result.order_number),
                    created_at: asString(result.created_at),
                    total: asNumber(result.total),
                    delivery_company: asString(result.delivery_company),
                });
                toast.success("تم العثور على الطلب");
            } else {
                const message = asString(result.message) || "الطلب غير موجود";
                setError(message);
                toast.error(message);
            }
        } catch (err) {
            console.error(err);
            setError("حدث خطأ أثناء البحث عن الطلب");
            toast.error("حدث خطأ غير متوقع");
        } finally {
            setLoading(false);
        }
    };

    const getStatusStep = (status: OrderStatus) => {
        switch (status) {
            case 'pending': return 1;
            case 'processing': return 2;
            case 'shipped': return 3;
            case 'delivered': return 4;
            default: return 0;
        }
    };

    const steps = [
        { id: 1, label: "تم الاستلام", icon: CheckCircle2 },
        { id: 2, label: "قيد التجهيز", icon: Package },
        { id: 3, label: "تم الشحن", icon: Truck },
        { id: 4, label: "تم التوصيل", icon: CheckCircle2 },
    ];

    const currentStep = orderData ? getStatusStep(orderData.status as OrderStatus) : 0;
    const isCancelled = orderData?.status === 'cancelled';

    return (
        <div className="min-h-screen flex flex-col bg-muted/30">
            <Header />
            <main className="flex-1 container py-12 md:py-20">
                <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
                    <div className="text-center space-y-4">
                        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Truck className="text-primary w-10 h-10" />
                        </div>
                        <h1 className="text-3xl font-black">تتبع حالة طلبك</h1>
                        <p className="text-muted-foreground max-w-lg mx-auto">
                            أدخل رقم الطلب ورقم الهاتف المستخدم في الطلب لمتابعة حالة شحنتك لحظة بلحظة
                        </p>
                    </div>

                    <div className="bg-background border border-border p-6 md:p-8 rounded-2xl shadow-xl">
                        <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSearch}>
                            <div className="space-y-2">
                                <Label htmlFor="orderNumber">رقم الطلب</Label>
                                <div className="relative">
                                    <Input
                                        id="orderNumber"
                                        placeholder="مثال: #10023"
                                        className="h-12 pr-10"
                                        value={orderNumber}
                                        onChange={(e) => setOrderNumber(e.target.value)}
                                    />
                                    <Package className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">رقم الهاتف</Label>
                                <div className="relative">
                                    <Input
                                        id="phone"
                                        placeholder="07xxxxxxxxx"
                                        className="h-12 pr-10"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        dir="ltr"
                                    />
                                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                                </div>
                            </div>
                            <div className="md:col-span-2 pt-2">
                                <Button className="w-full h-12 text-lg font-bold" disabled={loading}>
                                    {loading ? "جاري البحث..." : "تتبع الطلب"}
                                </Button>
                            </div>
                        </form>

                        {error && (
                            <div className="mt-6 p-4 bg-destructive/10 text-destructive rounded-lg flex items-center gap-2">
                                <AlertCircle size={20} />
                                <span className="font-bold">{error}</span>
                            </div>
                        )}

                        {orderData && (
                            <div className="mt-8 pt-8 border-t border-border animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex flex-wrap justify-between items-start gap-4 mb-8 bg-muted/30 p-4 rounded-xl">
                                    <div>
                                        <p className="text-sm text-muted-foreground">رقم الطلب</p>
                                        <p className="font-black text-xl">#{orderData.order_number}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">تاريخ الطلب</p>
                                        <p className="font-bold">{format(new Date(orderData.created_at), "dd MMMM yyyy", { locale: arSA })}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">الإجمالي</p>
                                        <p className="font-bold text-primary">{formatPrice(orderData.total)}</p>
                                    </div>
                                    {orderData.delivery_company && (
                                        <div>
                                            <p className="text-sm text-muted-foreground">شركة التوصيل</p>
                                            <p className="font-bold">{orderData.delivery_company}</p>
                                        </div>
                                    )}
                                </div>

                                {isCancelled ? (
                                    <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-6 text-center text-destructive">
                                        <XCircle size={48} className="mx-auto mb-4" />
                                        <h3 className="text-xl font-black mb-2">تم إلغاء هذا الطلب</h3>
                                        <p>يرجى التواصل مع خدمة العملاء لمزيد من التفاصيل.</p>
                                    </div>
                                ) : (
                                    <div className="relative">
                                        {/* Progress Bar Background */}
                                        <div className="absolute top-5 right-0 left-0 h-1 bg-muted rounded-full overflow-hidden hidden md:block">
                                            <div
                                                className="h-full bg-primary transition-all duration-1000 ease-out"
                                                style={{ width: `${Math.max(0, (currentStep - 1) * 33.33)}%` }}
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
                                            {steps.map((step) => {
                                                const isCompleted = currentStep >= step.id;
                                                const isCurrent = currentStep === step.id;

                                                return (
                                                    <div
                                                        key={step.id}
                                                        className={`flex flex-row md:flex-col items-center md:text-center gap-4 md:gap-2 p-4 rounded-xl border md:border-none transition-all duration-300
                                                            ${isCompleted ? "border-primary/20 bg-primary/5 md:bg-transparent" : "border-border bg-muted/10 md:bg-transparent opacity-60"}
                                                        `}
                                                    >
                                                        <div className={`
                                                            w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 transition-all duration-500
                                                            ${isCompleted ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-110" : "bg-muted text-muted-foreground"}
                                                        `}>
                                                            <step.icon size={20} />
                                                        </div>
                                                        <div className="flex-1 md:flex-none">
                                                            <p className={`font-bold ${isCompleted ? "text-primary" : "text-muted-foreground"}`}>
                                                                {step.label}
                                                            </p>
                                                            {isCurrent && (
                                                                <p className="text-xs text-primary animate-pulse font-medium mt-1">جاري الآن...</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="text-center">
                        <p className="text-sm text-muted-foreground">
                            تواجه مشكلة؟{" "}
                            <a href={`https://wa.me/${storeConfig.whatsapp}`} className="text-primary font-bold hover:underline">
                                تواصل معنا عبر واتساب
                            </a>
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default TrackOrder;
