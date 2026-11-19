import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import type { Tables } from "@/integrations/supabase/types";
import type { Profile as ProfileRow } from "@/integrations/supabase/overrides";
import { getErrorMessage } from "@/lib/utils";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { formatPrice } from "@/lib/format";
import { Package, User, MapPin, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
    const { user, profile, loading: authLoading } = useAuth();
    const [orders, setOrders] = useState<Tables<"orders">[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const navigate = useNavigate();

    // Form state
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");

    useEffect(() => {
        if (!authLoading && !user) {
            navigate("/auth");
            return;
        }

        if (profile) {
            setFullName(profile.full_name || "");
            setPhone(profile.phone || "");
            setAddress(profile.address || "");
            fetchOrders();
        }
    }, [user, profile, authLoading, navigate, fetchOrders]);

    const fetchOrders = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from("orders")
                .select("*")
                .eq("user_id", user?.id)
                .order("created_at", { ascending: false });

            if (error) throw error;
            setOrders(data || []);
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setUpdating(true);

        try {
            const { error } = await supabase
                .from("profiles")
                .update({
                    full_name: fullName,
                    phone: phone,
                    address: address
                })
                .eq("id", user?.id);

            if (error) throw error;
            toast.success("تم تحديث الملف الشخصي بنجاح");
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            setUpdating(false);
        }
    };

    if (authLoading || loading) {
        return <div className="min-h-screen flex items-center justify-center">جاري التحميل...</div>;
    }

    return (
        <div className="min-h-screen flex flex-col bg-muted/30">
            <Header />
            <main className="flex-1 container py-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold mb-8">حسابي</h1>

                    {/* Loyalty Points Card */}
                    <Card className="mb-8 border-none bg-gradient-to-l from-indigo-600 to-indigo-700 text-white shadow-lg overflow-hidden relative">
                        <div className="absolute -right-6 -top-6 opacity-10">
                            <Package size={120} />
                        </div>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-indigo-100 text-sm font-medium">نقاط الولاء المتوفرة</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-end justify-between">
                                <div>
                                    <div className="text-4xl font-black mb-1">{(profile as ProfileRow | null)?.points || 0}</div>
                                    <p className="text-indigo-200 text-xs">تعادل خصم بقيمة {formatPrice(((profile as ProfileRow | null)?.points || 0) * 10)}</p>
                                </div>
                                <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm border border-white/10">
                                    <Package className="text-white" size={24} />
                                </div>
                            </div>
                        </CardContent>
                        <div className="bg-black/10 px-6 py-2 text-[10px] text-indigo-100 flex justify-between items-center">
                            <span>* تنتهي صلاحية النقاط بعد سنة من تاريخ اكتسابها</span>
                        </div>
                    </Card>

                    <Tabs defaultValue="orders" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-8">
                            <TabsTrigger value="orders" className="flex items-center gap-2">
                                <Package size={18} />
                                <span>طلباتي</span>
                            </TabsTrigger>
                            <TabsTrigger value="settings" className="flex items-center gap-2">
                                <User size={18} />
                                <span>إعدادات الحساب</span>
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="orders">
                            <div className="space-y-4">
                                {orders.length === 0 ? (
                                    <Card>
                                        <CardContent className="py-12 text-center text-muted-foreground">
                                            <Package className="mx-auto mb-4 opacity-20" size={64} />
                                            <p>ليس لديك أي طلبات بعد</p>
                                            <Button variant="link" onClick={() => navigate("/products")}>
                                                تصفح المنتجات الآن
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    orders.map((order) => (
                                        <Card key={order.id} className="overflow-hidden">
                                            <div className="bg-primary/5 p-4 border-b flex justify-between items-center">
                                                <div>
                                                    <p className="text-xs text-muted-foreground">رقم الطلب</p>
                                                    <p className="font-bold">#{order.order_number}</p>
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-xs text-muted-foreground">التاريخ</p>
                                                    <p className="text-sm">{new Date(order.created_at).toLocaleDateString('ar-EG')}</p>
                                                </div>
                                            </div>
                                            <CardContent className="p-4 flex flex-col md:flex-row justify-between gap-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <span className="font-medium">الحالة:</span>
                                                        <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                                                            {order.status === 'pending' ? 'قيد الانتظار' : order.status}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm font-bold mt-2">
                                                        <span>الإجمالي:</span>
                                                        <span className="text-primary">{formatPrice(order.total)}</span>
                                                    </div>
                                                </div>
                                                <Button variant="outline" size="sm" onClick={() => toast.info("تفاصيل الطلب ستكون متاحة قريباً")}>
                                                    عرض التفاصيل
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    ))
                                )}
                            </div>
                        </TabsContent>

                        <TabsContent value="settings">
                            <Card>
                                <CardHeader>
                                    <CardTitle>المعلومات الشخصية</CardTitle>
                                    <CardDescription>قم بتحديث بياناتك لتسهيل عملية التوصيل في المرات القادمة</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="fullName">الاسم الكامل</Label>
                                                <Input
                                                    id="fullName"
                                                    value={fullName}
                                                    onChange={(e) => setFullName(e.target.value)}
                                                    placeholder="أدخل اسمك الكامل"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="email">البريد الإلكتروني</Label>
                                                <Input id="email" value={user?.email} disabled className="bg-muted" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="phone">رقم الهاتف</Label>
                                                <div className="relative">
                                                    <Phone className="absolute right-3 top-3 text-muted-foreground" size={16} />
                                                    <Input
                                                        id="phone"
                                                        value={phone}
                                                        onChange={(e) => setPhone(e.target.value)}
                                                        placeholder="07XXXXXXXX"
                                                        className="pr-10"
                                                        dir="ltr"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2 md:col-span-2">
                                                <Label htmlFor="address">العنوان الافتراضي</Label>
                                                <div className="relative">
                                                    <MapPin className="absolute right-3 top-3 text-muted-foreground" size={16} />
                                                    <Input
                                                        id="address"
                                                        value={address}
                                                        onChange={(e) => setAddress(e.target.value)}
                                                        placeholder="المحافظة، المنطقة، أقرب نقطة دالة"
                                                        className="pr-10"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <Button type="submit" disabled={updating} className="w-full md:w-auto px-8">
                                            {updating ? "جاري الحفظ..." : "حفظ التغييرات"}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>

                            <Card className="mt-8 border-destructive/20 bg-destructive/5">
                                <CardHeader>
                                    <CardTitle className="text-destructive">الخروج</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Button
                                        variant="destructive"
                                        onClick={async () => {
                                            await supabase.auth.signOut();
                                            navigate("/");
                                            toast.success("تم تسجيل الخروج");
                                        }}
                                    >
                                        تسجيل الخروج من الحساب
                                    </Button>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
            <Footer />
        </div>
    );
}
