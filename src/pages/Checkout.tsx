import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice } from "@/lib/format";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { Trash2, Ticket, X, Loader2, MapPin, CheckCircle, Coins } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Badge } from "@/components/ui/badge";

const Checkout = () => {
  const { items, getSubtotal, getDiscountAmount, coupon, applyCoupon, removeCoupon, clearCart, removeItem } = useCartStore();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [usePoints, setUsePoints] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    governorate_id: "",
    area: "",
    landmark: "",
    notes: "",
    latitude: null as number | null,
    longitude: null as number | null,
    map_url: null as string | null,
  });

  useEffect(() => {
    if (profile) {
      setForm(prev => ({
        ...prev,
        name: profile.full_name || prev.name,
        phone: profile.phone || prev.phone,
        area: profile.address || prev.area,
        latitude: (profile as any).latitude || null,
        longitude: (profile as any).longitude || null,
        map_url: (profile as any).map_url || null,
      }));
    }
  }, [profile]);

  const { data: governorates } = useQuery({
    queryKey: ["governorates"],
    queryFn: async () => {
      const { data } = await supabase.from("governorates").select("*").order("sort_order");
      return data ?? [];
    },
  });

  // Fetch regions for the selected governorate
  const { data: regions } = useQuery({
    queryKey: ["regions", form.governorate_id],
    queryFn: async () => {
      if (!form.governorate_id) return [];
      const { data } = await supabase
        .from("regions")
        .select("*")
        .eq("governorate_id", form.governorate_id)
        .order("sort_order");
      return data ?? [];
    },
    enabled: !!form.governorate_id,
  });

  const selectedGov = governorates?.find((g) => g.id === form.governorate_id);
  const deliveryCost = selectedGov?.delivery_price ?? 0;
  const subtotal = getSubtotal();
  const discount = getDiscountAmount();

  // Loyalty Points Calculations
  const availablePoints = (profile as any)?.points || 0;
  // Calculate points only for products that have loyalty points enabled
  const earnedPoints = items.reduce((sum, item) => {
    if ((item.product as any).loyalty_points_enabled !== false) {
      const price = item.product.discount_price ?? item.product.price;
      return sum + Math.floor((price * item.quantity) / 100);
    }
    return sum;
  }, 0);

  // 1 point = 10 IQD discount
  const pointsRedemptionValue = usePoints ? Math.min(availablePoints * 10, subtotal - discount) : 0;
  const pointsToSpend = usePoints ? Math.floor(pointsRedemptionValue / 10) : 0;

  // Total = Subtotal - Discount - PointsDiscount + Delivery
  const total = Math.max(0, subtotal - discount - pointsRedemptionValue) + deliveryCost;

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error("المتصفح لا يدعم تحديد الموقع الجغرافي");
      return;
    }

    setGettingLocation(true);

    const options = {
      enableHighAccuracy: true,
      timeout: 10000, // 10 seconds timeout
      maximumAge: 60000 // 1 minute cached location acceptable
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

        setForm(prev => ({
          ...prev,
          latitude,
          longitude,
          map_url: mapUrl
        }));

        toast.success("تم تحديد موقعك بنجاح");
        setGettingLocation(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        let message = "فشل تحديد الموقع. يرجى التأكد من تفعيل خدمة الموقع في جهازك.";

        if (error.code === error.TIMEOUT) {
          message = "انتهت مهلة تحديد الموقع. يرجى المحاولة مرة أخرى في مكان تتوفر فيه إشارة أفضل.";
        } else if (error.code === error.PERMISSION_DENIED) {
          message = "تم رفض الإذن للوصول للموقع. يرجى تفعيله من إعدادات المتصفح.";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          message = "معلومات الموقع غير متوفرة حالياً.";
        }

        toast.error(message);
        setGettingLocation(false);
      },
      options
    );
  };

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setIsValidating(true);
    try {
      const { data, error } = await supabase.rpc('validate_coupon', {
        p_code: couponInput.trim(),
        p_total: subtotal
      });

      if (error) throw error;

      const couponData = data as any;
      if (couponData.valid) {
        applyCoupon({
          id: couponData.id,
          code: couponData.code,
          type: couponData.discount_type,
          value: couponData.value
        });
        toast.success(`تم تطبيق الكوبون - خصم ${couponData.discount_type === 'percentage' ? '%' + couponData.value : formatPrice(couponData.value)}`);
        setCouponInput("");
      } else {
        toast.error(couponData.message || "الكوبون غير صالح");
      }
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ أثناء التحقق من الكوبون");
    } finally {
      setIsValidating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("السلة فارغة");
      return;
    }
    if (!form.name.trim() || !form.phone.trim() || !form.governorate_id || !form.area.trim()) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    setLoading(true);
    try {
      const orderItems = items.map((item) => ({
        product_id: item.product.id,
        product_name: item.product.name,
        quantity: item.quantity,
        price: item.product.discount_price ?? item.product.price,
      }));

      // Call the updated place_order RPC
      const { data: orderNumber, error } = await supabase.rpc("place_order", {
        p_customer_name: form.name.trim(),
        p_customer_phone: form.phone.trim(),
        p_governorate_id: form.governorate_id,
        p_area: form.area.trim(),
        p_nearest_landmark: form.landmark.trim() || null,
        p_notes: form.notes.trim() || null,
        p_subtotal: subtotal,
        p_delivery_cost: deliveryCost,
        p_discount: discount,
        p_total: total,
        p_coupon_id: coupon?.id || null,
        p_items: orderItems,
        p_user_id: user?.id || null,
        p_latitude: form.latitude,
        p_longitude: form.longitude,
        p_map_url: form.map_url,
        p_points_spent: pointsToSpend,
        p_points_discount: pointsRedemptionValue,
        p_points_earned: earnedPoints
      });

      if (error) throw error;

      clearCart();
      navigate(`/thank-you?order=${orderNumber}`);

    } catch (err) {
      console.error(err);
      toast.error("حدث خطأ أثناء إرسال الطلب");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">السلة فارغة</h1>
          <p className="text-muted-foreground mb-6">أضف منتجات للسلة أولاً</p>
          <Link to="/products">
            <Button>تصفح المنتجات</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfcfc]">
      <Header />
      <main className="flex-1 container py-8">
        <h1 className="text-2xl font-bold mb-8">إتمام الطلب</h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Form */}
          <form onSubmit={handleSubmit} className="md:col-span-2 space-y-4">
            <div className="bg-white p-6 rounded-xl border border-border shadow-sm space-y-4">
              <h2 className="font-bold text-lg mb-4">معلومات التوصيل</h2>

              <div className="mt-4 p-4 bg-muted/30 rounded-lg border border-border">
                <div className="flex items-center justify-between mb-2">
                  <Label className="font-bold flex items-center gap-2">
                    <MapPin className="text-primary" size={18} />
                    موقع التوصيل
                  </Label>
                  {form.map_url ? (
                    <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-200 gap-1">
                      <CheckCircle size={12} />
                      تم تحديد الموقع
                    </Badge>
                  ) : null}
                </div>
                <p className="text-xs text-muted-foreground mb-4">
                  قم بتحديد موقعك الحالي لتسهيل عملية التوصيل وسرعة الوصول إليك.
                </p>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGetLocation}
                    disabled={gettingLocation}
                    className="w-full gap-2"
                  >
                    {gettingLocation ? <Loader2 className="animate-spin" size={16} /> : <MapPin size={16} />}
                    {form.map_url ? "تحديث موقعي الحالي" : "تحديد موقعي الحالي"}
                  </Button>
                </div>
                {form.map_url && (
                  <div className="mt-2 text-xs text-muted-foreground truncate" dir="ltr">
                    {form.map_url}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">الاسم الكامل *</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    maxLength={100}
                    autoComplete="name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">رقم الهاتف *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    required
                    maxLength={15}
                    dir="ltr"
                    autoComplete="tel"
                    inputMode="tel"
                    pattern="[0-9]*"
                    placeholder="07XXXXXXXX"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>المحافظة *</Label>
                  <Select value={form.governorate_id} onValueChange={(v) => {
                    setForm({ ...form, governorate_id: v, area: "" }); // Reset area/region when gov changes
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر المحافظة" />
                    </SelectTrigger>
                    <SelectContent>
                      {governorates?.map((gov) => (
                        <SelectItem key={gov.id} value={gov.id}>
                          {gov.name} - توصيل {formatPrice(gov.delivery_price)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="area">المنطقة / الحي *</Label>
                  {regions && regions.length > 0 ? (
                    <Select value={form.area} onValueChange={(v) => setForm({ ...form, area: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر المنطقة" />
                      </SelectTrigger>
                      <SelectContent>
                        {regions.map((region: any) => (
                          <SelectItem key={region.id} value={region.name}>
                            {region.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input id="area" value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} required maxLength={100} placeholder="اسم المنطقة أو الحي" />
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="landmark">أقرب نقطة دالة</Label>
                <Input id="landmark" value={form.landmark} onChange={(e) => setForm({ ...form, landmark: e.target.value })} maxLength={200} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">ملاحظات</Label>
                <Textarea id="notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} maxLength={500} />
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full text-lg h-14 font-bold" disabled={loading}>
              {loading ? "جاري إرسال الطلب..." : `تأكيد الطلب (${formatPrice(total)})`}
            </Button>
          </form>

          {/* Order Summary */}
          <div className="space-y-4 h-fit sticky top-24">
            <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
              <h2 className="font-bold text-lg mb-4">ملخص الطلب</h2>
              <div className="space-y-4 mb-4">
                {items.map((item) => (
                  <div key={item.product.id} className="flex justify-between items-start text-sm pb-4 border-b border-dashed border-gray-100 last:border-0 last:pb-0">
                    <div className="flex-1">
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-muted-foreground text-xs mt-1">الكمية: {item.quantity}</p>
                    </div>
                    <div className="text-left">
                      <p className="font-bold">{formatPrice((item.product.discount_price ?? item.product.price) * item.quantity)}</p>
                      <button onClick={() => removeItem(item.product.id)} className="text-xs text-destructive hover:underline mt-1">
                        حذف
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon Section */}
              <div className="border-t border-border pt-4 mb-4">
                {coupon ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-emerald-700">
                      <Ticket size={16} />
                      <div>
                        <p className="font-bold text-sm">{coupon.code}</p>
                        <p className="text-[10px]">خصم {coupon.type === 'percentage' ? `%${coupon.value}` : formatPrice(coupon.value)}</p>
                      </div>
                    </div>
                    <button onClick={removeCoupon} className="text-emerald-700 hover:text-emerald-900 bg-emerald-100 p-1 rounded-full">
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      placeholder="كود الخصم"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      maxLength={20}
                      className="uppercase text-sm h-9"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={handleApplyCoupon}
                      disabled={isValidating || !couponInput}
                      size="sm"
                    >
                      {isValidating ? <Loader2 size={14} className="animate-spin" /> : "تطبيق"}
                    </Button>
                  </div>
                )}
              </div>

              {/* Loyalty Points Section */}
              {user && availablePoints > 0 && (
                <div className="border-t border-border pt-4 mb-4">
                  <div className={`p-3 rounded-lg border transition-colors ${usePoints ? "bg-amber-50 border-amber-200" : "bg-white border-border"}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-full ${usePoints ? "bg-amber-100 text-amber-600" : "bg-slate-100 text-slate-500"}`}>
                          <Coins size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-bold">نقاط الولاء</p>
                          <p className="text-[10px] text-muted-foreground">لديك {availablePoints} نقطة ({formatPrice(availablePoints * 10)})</p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant={usePoints ? "default" : "outline"}
                        size="sm"
                        onClick={() => setUsePoints(!usePoints)}
                        className={usePoints ? "bg-amber-500 hover:bg-amber-600 border-none h-8" : "h-8"}
                      >
                        {usePoints ? "إلغاء الاستخدام" : "استخدام الآن"}
                      </Button>
                    </div>
                    {usePoints && (
                      <div className="mt-2 text-[10px] text-amber-700 font-medium animate-in fade-in slide-in-from-top-1">
                        سيتم خصم {formatPrice(pointsRedemptionValue)} من الإجمالي مقابل {pointsToSpend} نقطة.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Points to Earn Info */}
              {earnedPoints > 0 && (
                <div className="mb-4 space-y-2 px-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-blue-50 text-blue-600 border-blue-100 rounded-md font-bold text-[10px] py-0.5 px-2">
                      <Coins size={10} className="ml-1" />
                      مربح الطلب: {earnedPoints} نقطة
                    </Badge>
                  </div>
                  {!user && (
                    <p className="text-[10px] text-muted-foreground leading-relaxed bg-blue-50/50 p-2 rounded-lg border border-blue-100/50">
                      💡 <Link to="/auth" className="text-blue-600 font-bold underline">سجل دخولك</Link> لكي لا تضيع عليك هذه النقاط! سيتم حفظها تلقائياً عند إنشائك حساباً بنفس رقم الهاتف.
                    </p>
                  )}
                </div>
              )}

              <div className="border-t border-border pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>المجموع الفرعي</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>التوصيل</span>
                  <span>{deliveryCost > 0 ? formatPrice(deliveryCost) : "مجاني / غير محدد"}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>قيمة الكوبون</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                {pointsRedemptionValue > 0 && (
                  <div className="flex justify-between text-amber-600 font-bold">
                    <span>خصم النقاط</span>
                    <span>-{formatPrice(pointsRedemptionValue)}</span>
                  </div>
                )}
                <div className="flex justify-between font-black text-lg border-t border-border pt-4 mt-2">
                  <span>الإجمالي</span>
                  <span className="text-primary">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Checkout;
