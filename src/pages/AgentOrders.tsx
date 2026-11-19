import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Phone, MapPin, CheckCircle2, XCircle, LogOut, Loader2, History, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface AgentOrderRow {
    id: string;
    order_number: number;
    customer_name: string;
    customer_phone: string;
    area: string | null;
    nearest_landmark: string | null;
    total: number;
    status: string;
    created_at: string;
    map_url: string | null;
    governorates: { name: string } | null;
}

/**
 * The generated relational types for the embedded `governorates(name)` select
 * recurse past TypeScript's instantiation depth limit (TS2589). Reading these
 * two queries through a default-schema client handle sidesteps that compiler
 * limitation; the rows are then validated against `AgentOrderRow`. Runtime
 * behavior is identical — the same query is issued.
 */
const ordersDb: SupabaseClient = supabase;

export default function AgentOrders() {
    const { user, profile, loading: authLoading } = useAuth();
    const [activeTab, setActiveTab] = useState<"current" | "history">("current");
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { data: currentOrders, isLoading: isLoadingCurrent } = useQuery({
        queryKey: ["agent-orders-current", user?.id],
        queryFn: async () => {
            if (!user) return [];
            const { data, error } = await ordersDb
                .from("orders")
                .select(`
                    id, order_number, customer_name, customer_phone, area, nearest_landmark, total, status, created_at, map_url,
                    governorates(name)
                `)
                .eq("agent_id", user.id)
                .in("status", ["shipped", "preparing", "contacted"])
                .order("created_at", { ascending: false });

            if (error) throw error;
            return (data ?? []) as unknown as AgentOrderRow[];
        },
        enabled: !!user && activeTab === "current"
    });

    const { data: historyOrders, isLoading: isLoadingHistory } = useQuery({
        queryKey: ["agent-orders-history", user?.id],
        queryFn: async () => {
            if (!user) return [];
            const { data, error } = await ordersDb
                .from("orders")
                .select(`
                    id, order_number, customer_name, customer_phone, area, nearest_landmark, total, status, created_at, map_url,
                    governorates(name)
                `)
                .eq("agent_id", user.id)
                .in("status", ["delivered", "returned"])
                .order("created_at", { ascending: false })
                .limit(50);

            if (error) throw error;
            return (data ?? []) as unknown as AgentOrderRow[];
        },
        enabled: !!user && activeTab === "history"
    });

    const updateStatus = useMutation({
        mutationFn: async ({ orderId, status }: { orderId: string, status: string }) => {
            const { error } = await supabase
                .from("orders")
                .update({ status })
                .eq("id", orderId);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["agent-orders-current"] });
            queryClient.invalidateQueries({ queryKey: ["agent-orders-history"] });
            toast.success("تم تحديث حالة الطلب");
        },
        onError: () => toast.error("حدث خطأ أثناء التحديث"),
    });

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate("/auth");
    };

    if (authLoading) return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">جاري التحميل...</p>
        </div>
    );

    if (!user || profile?.role !== "agent") {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
                <XCircle className="h-16 w-16 text-destructive mb-4" />
                <h2 className="text-xl font-bold mb-2">غير مصرح لك بالدخول</h2>
                <p className="text-muted-foreground mb-6">هذه الصفحة مخصصة للمناديب فقط.</p>
                <Button onClick={() => navigate("/auth")}>تسجيل الدخول</Button>
            </div>
        );
    }

    const isLoading = activeTab === "current" ? isLoadingCurrent : isLoadingHistory;
    const orders = activeTab === "current" ? currentOrders : historyOrders;

    return (
        <div className="min-h-screen bg-slate-50 pb-20" dir="rtl">
            {/* Header */}
            <div className="bg-white border-b sticky top-0 z-20 px-4 pt-4 pb-0 shadow-sm safe-top">
                <div className="flex items-center justify-between mb-2">
                    <div>
                        <h1 className="text-lg font-bold">لوحة المندوب</h1>
                        <p className="text-xs text-muted-foreground">أهلاً، {profile.full_name}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={handleLogout} className="text-destructive">
                        <LogOut size={20} />
                    </Button>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mt-2">
                    <button
                        onClick={() => setActiveTab("current")}
                        className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors flex items-center justify-center gap-2 ${activeTab === "current" ? "border-primary text-primary" : "border-transparent text-muted-foreground"
                            }`}
                    >
                        <ShoppingBag size={18} />
                        الطلبات الحالية
                    </button>
                    <button
                        onClick={() => setActiveTab("history")}
                        className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors flex items-center justify-center gap-2 ${activeTab === "history" ? "border-primary text-primary" : "border-transparent text-muted-foreground"
                            }`}
                    >
                        <History size={18} />
                        سجل الطلبات
                    </button>
                </div>
            </div>

            {/* Content List */}
            <div className="p-4 space-y-4">
                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-primary/30" />
                    </div>
                ) : orders?.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="bg-white rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4 border shadow-sm text-slate-200">
                            {activeTab === "current" ? <ShoppingBag size={40} /> : <History size={40} />}
                        </div>
                        <p className="text-muted-foreground font-medium">
                            {activeTab === "current" ? "لا توجد طلبات جارية حالياً" : "سجل الطلبات فارغ"}
                        </p>
                    </div>
                ) : (
                    orders?.map((order) => (
                        <Card key={order.id} className="border-none shadow-sm overflow-hidden">
                            <CardHeader className="bg-slate-50/50 py-3 px-4 border-b">
                                <div className="flex justify-between items-center">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-muted-foreground">رقم الطلب</span>
                                        <span className="text-sm font-bold">#{order.order_number}</span>
                                    </div>
                                    <Badge
                                        variant="outline"
                                        className={`
                                            ${order.status === 'delivered' ? "bg-green-50 text-green-700 border-green-200" : ""}
                                            ${order.status === 'returned' ? "bg-red-50 text-red-700 border-red-200" : ""}
                                            ${activeTab === 'current' ? "bg-amber-50 text-amber-700 border-amber-200" : ""}
                                        `}
                                    >
                                        {order.status === 'delivered' ? "تم التوصيل" :
                                            order.status === 'returned' ? "مسترجع" : "قيد التوصيل"}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="p-4 space-y-4">
                                {activeTab === "current" ? (
                                    <>
                                        {/* Customer Info */}
                                        <div className="flex items-start gap-3">
                                            <div className="bg-primary/10 p-2 rounded">
                                                <Phone className="text-primary" size={18} />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-bold text-sm">{order.customer_name}</p>
                                                <p className="text-xs text-muted-foreground" dir="ltr">{order.customer_phone}</p>
                                            </div>
                                            <a href={`tel:${order.customer_phone}`}>
                                                <Button size="sm" variant="outline" className="rounded-full h-10 w-10 p-0 border-green-200 text-green-600">
                                                    <Phone size={18} />
                                                </Button>
                                            </a>
                                        </div>

                                        {/* Address Info */}
                                        <div className="flex items-start gap-3">
                                            <div className="bg-blue-100 p-2 rounded">
                                                <MapPin className="text-blue-600" size={18} />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium">{order.governorates?.name} - {order.area}</p>
                                                {order.nearest_landmark && (
                                                    <p className="text-xs text-muted-foreground mt-0.5">
                                                        أقرب نقطة: {order.nearest_landmark}
                                                    </p>
                                                )}
                                            </div>
                                            {order.map_url && (
                                                <a href={order.map_url} target="_blank" rel="noreferrer">
                                                    <Button size="sm" variant="outline" className="rounded-full h-10 w-10 p-0 border-blue-200 text-blue-600">
                                                        <MapPin size={18} />
                                                    </Button>
                                                </a>
                                            )}
                                        </div>

                                        <div className="pt-2 border-t flex justify-between items-center">
                                            <div className="flex flex-col">
                                                <span className="text-xs text-muted-foreground">المبلغ المستحق</span>
                                                <span className="font-black text-blue-600">{formatPrice(order.total)}</span>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="grid grid-cols-2 gap-3 pt-2">
                                            <Button
                                                variant="outline"
                                                className="border-red-200 text-red-600 h-11 font-bold shadow-none"
                                                onClick={() => {
                                                    if (confirm("هل تريد تعليم الطلب كمسترجع؟")) {
                                                        updateStatus.mutate({ orderId: order.id, status: "returned" });
                                                    }
                                                }}
                                            >
                                                <XCircle className="ml-2" size={18} />
                                                مسترجع
                                            </Button>
                                            <Button
                                                className="bg-green-600 hover:bg-green-700 h-11 font-bold"
                                                onClick={() => {
                                                    if (confirm("هل تم تسليم الطلب واستلام المبلغ؟")) {
                                                        updateStatus.mutate({ orderId: order.id, status: "delivered" });
                                                    }
                                                }}
                                            >
                                                <CheckCircle2 className="ml-2" size={18} />
                                                تم التوصيل
                                            </Button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-bold text-sm mb-1">{order.customer_name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(order.created_at).toLocaleDateString('ar-IQ')}
                                            </p>
                                        </div>
                                        <div className="text-left">
                                            <p className="font-black text-blue-600 text-sm">{formatPrice(order.total)}</p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
