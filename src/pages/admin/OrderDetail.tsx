import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { ArrowRight, Phone, MapPin, ClipboardList, Info, Printer, MessageCircle, Truck, Eye, Edit } from "lucide-react";
import type { Order } from "@/integrations/supabase/overrides";
import { db } from "@/integrations/supabase/db";

interface OrderItemRow {
    id: string;
    product_id: string | null;
    product_name: string | null;
    price: number;
    quantity: number;
    products: { slug: string } | null;
}

type OrderDetailData = Order & {
    governorates: { name: string } | null;
    order_items: OrderItemRow[];
    subtotal: number | null;
    delivery_cost: number | null;
    discount: number | null;
    notes: string | null;
};


const statusMap: Record<string, { label: string, color: string }> = {
    new: { label: "جديد", color: "bg-blue-500" },
    contacted: { label: "تم التواصل", color: "bg-purple-500" },
    preparing: { label: "قيد التجهيز", color: "bg-amber-500" },
    shipped: { label: "تم الشحن", color: "bg-indigo-500" },
    delivered: { label: "تم التوصيل", color: "bg-green-500" },
    cancelled: { label: "ملغي", color: "bg-destructive" },
    returned: { label: "مرجع", color: "bg-gray-500" },
};

export default function AdminOrderDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: order, isLoading } = useQuery({
        queryKey: ["admin-order", id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("orders")
                .select(`
          *,
          governorates(name),
          order_items(
            *,
            products(slug)
          )
        `)
                .eq("id", id)
                .single();

            if (error) throw error;
            // The embedded select mixes relations and columns absent from the
            // stale generated types; cast to the explicit contract.
            return data as unknown as OrderDetailData;
        }
    });

    const { data: agents } = useQuery({
        queryKey: ["admin-agents"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("profiles")
                .select("id, full_name, email")
                .eq("role", "agent");
            if (error) throw error;
            return data;
        }
    });

    const updateAgent = useMutation({
        mutationFn: async (agentId: string | null) => {
            const { error } = await db
                .from("orders")
                .update({ agent_id: agentId })
                .eq("id", id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-order", id] });
            toast.success("تم تعيين المندوب بنجاح");
        },
        onError: () => toast.error("حدث خطأ أثناء تعيين المندوب"),
    });

    const updateStatus = useMutation({
        mutationFn: async (newStatus: string) => {
            const { error } = await supabase
                .from("orders")
                .update({ status: newStatus })
                .eq("id", id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-order", id] });
            toast.success("تم تحديث حالة الطلب");
        },
        onError: () => toast.error("حدث خطأ أثناء تحديث الحالة"),
    });

    const updateNotes = useMutation({
        mutationFn: async (notes: string) => {
            const { error } = await db
                .from("orders")
                .update({ admin_notes: notes })
                .eq("id", id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-order", id] });
            toast.success("تم حفظ الملاحظات");
        },
        onError: () => toast.error("حدث خطأ أثناء حفظ الملاحظات"),
    });

    const handlePrint = () => {
        window.print();
    };

    if (isLoading) return <div className="text-center py-20">جاري التحميل...</div>;
    if (!order) return <div className="text-center py-20 text-destructive">الطلب غير موجود</div>;

    return (
        <div className="space-y-6">
            {/* Print Styles */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    @page { margin: 10mm; }
                    body { 
                        visibility: hidden; 
                        background: white !important;
                    }
                    #printable-area { 
                        visibility: visible; 
                        position: absolute; 
                        left: 0; 
                        top: 0; 
                        width: 100%; 
                        padding: 0;
                        margin: 0;
                        display: block !important;
                    }
                    .no-print { display: none !important; }
                    /* Fix for extra blank pages */
                    html, body {
                        height: auto !important;
                        overflow: visible !important;
                        margin: 0 !important;
                    }
                }
            `}} />

            <div className="flex items-center gap-4 no-print">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                    <ArrowRight size={20} />
                </Button>
                <h2 className="text-2xl font-bold">تفاصيل الطلب: {order.order_number}</h2>
                <Badge className={`mr-2 ${statusMap[order.status || 'new'].color}`}>
                    {statusMap[order.status || 'new'].label}
                </Badge>
                <div className="mr-auto flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2" onClick={handlePrint}>
                        <Printer size={18} />
                        طباعة الفاتورة
                    </Button>
                </div>
            </div>

            {/* Hidden Printable Area for professional invoice */}
            <div id="printable-area" className="hidden print:block text-right" dir="rtl">
                <div className="flex justify-between items-start mb-8 border-b pb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-primary">منجور</h1>
                        <p className="text-sm text-muted-foreground">منجور</p>
                    </div>
                    <div className="text-left">
                        <h2 className="text-xl font-bold">فاتورة طلب</h2>
                        <p className="text-sm">رقم الطلب: {order.order_number}</p>
                        <p className="text-sm">التاريخ: {order.created_at && new Date(order.created_at).toLocaleDateString('ar-IQ')}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-8">
                    <div>
                        <h3 className="font-bold border-b mb-2 pb-1">بيانات العميل</h3>
                        <p>الاسم: {order.customer_name}</p>
                        <p>الهاتف: {order.customer_phone}</p>
                        <p>العنوان: {order.governorates?.name} - {order.area}</p>
                        {order.nearest_landmark && <p>أقرب نقطة دالة: {order.nearest_landmark}</p>}
                    </div>
                    <div>
                        <h3 className="font-bold border-b mb-2 pb-1">تفاصيل الدفع</h3>
                        <p>حالة الطلب: {statusMap[order.status || 'new'].label}</p>
                        <p>طريقة الدفع: الدفع عند الاستلام</p>
                    </div>
                </div>

                <table className="w-full border-collapse mb-8">
                    <thead>
                        <tr className="bg-muted">
                            <th className="border p-2 text-right">المنتج</th>
                            <th className="border p-2 text-center">السعر</th>
                            <th className="border p-2 text-center">الكمية</th>
                            <th className="border p-2 text-left">المجموع</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.order_items.map((item: OrderItemRow) => (
                            <tr key={item.id}>
                                <td className="border p-2">{item.product_name}</td>
                                <td className="border p-2 text-center">{formatPrice(item.price)}</td>
                                <td className="border p-2 text-center">{item.quantity}</td>
                                <td className="border p-2 text-left">{formatPrice(item.price * item.quantity)}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan={3} className="border p-2 text-left font-bold">المجموع الفرعي</td>
                            <td className="border p-2 text-left">{formatPrice(order.subtotal)}</td>
                        </tr>
                        <tr>
                            <td colSpan={3} className="border p-2 text-left font-bold">التوصيل</td>
                            <td className="border p-2 text-left">{formatPrice(order.delivery_cost)}</td>
                        </tr>
                        {order.discount > 0 && (
                            <tr>
                                <td colSpan={3} className="border p-2 text-left font-bold text-green-600">الخصم</td>
                                <td className="border p-2 text-left text-green-600">-{formatPrice(order.discount)}</td>
                            </tr>
                        )}
                        {order.points_discount > 0 && (
                            <tr>
                                <td colSpan={3} className="border p-2 text-left font-bold text-amber-600">خصم النقاط ({order.points_spent} نقطة)</td>
                                <td className="border p-2 text-left text-amber-600">-{formatPrice(order.points_discount)}</td>
                            </tr>
                        )}
                        {order.points_earned > 0 && (
                            <tr>
                                <td colSpan={3} className="border p-2 text-left font-bold text-blue-600 italic">النقاط المكتسبة من الطلب</td>
                                <td className="border p-2 text-left text-blue-600 italic">+{order.points_earned} نقطة</td>
                            </tr>
                        )}
                        <tr className="bg-muted/50 font-bold">
                            <td colSpan={3} className="border p-2 text-left text-lg">المجموع الكلي</td>
                            <td className="border p-2 text-left text-lg">{formatPrice(order.total)}</td>
                        </tr>
                    </tfoot>
                </table>

                <div className="text-center mt-12 pt-8 border-t text-sm text-muted-foreground">
                    شكراً لشرائكم من منجور
                </div>
            </div>


            <div className="grid md:grid-cols-3 gap-6">
                {/* Left: Items & Billing */}
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ClipboardList size={20} />
                                المنتجات
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-border">
                                {order.order_items.map((item: OrderItemRow) => (
                                    <div key={item.id} className="p-4 flex justify-between items-center">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 group">
                                                <p className="font-medium">{item.product_name}</p>
                                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity no-print">
                                                    <a
                                                        href={`/product/${item.products?.slug || item.product_id}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        title="عرض في المتجر"
                                                    >
                                                        <Button variant="ghost" size="icon" className="h-7 w-7">
                                                            <Eye size={14} className="text-blue-500" />
                                                        </Button>
                                                    </a>
                                                    <a
                                                        href={`/admin/products/${item.product_id}/edit`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        title="تعديل المنتج"
                                                    >
                                                        <Button variant="ghost" size="icon" className="h-7 w-7">
                                                            <Edit size={14} className="text-amber-500" />
                                                        </Button>
                                                    </a>
                                                </div>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                {formatPrice(item.price)} × {item.quantity}
                                            </p>
                                        </div>
                                        <p className="font-bold whitespace-nowrap">{formatPrice(item.price * item.quantity)}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="p-4 bg-muted/30 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>المجموع الفرعي</span>
                                    <span>{formatPrice(order.subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>التوصيل</span>
                                    <span>{formatPrice(order.delivery_cost)}</span>
                                </div>
                                {order.discount > 0 && (
                                    <div className="flex justify-between text-sm text-green-600">
                                        <span>الخصم</span>
                                        <span>-{formatPrice(order.discount)}</span>
                                    </div>
                                )}
                                {order.points_discount > 0 && (
                                    <div className="flex justify-between text-sm text-amber-600 font-bold">
                                        <span>خصم النقاط ({order.points_spent} نقطة)</span>
                                        <span>-{formatPrice(order.points_discount)}</span>
                                    </div>
                                )}
                                {order.points_earned > 0 && (
                                    <div className="flex justify-between text-sm text-blue-600 italic">
                                        <span>النقاط المكتسبة من الطلب</span>
                                        <span>+{order.points_earned} نقطة</span>
                                    </div>
                                )}
                                <Separator className="my-2" />
                                <div className="flex justify-between font-bold text-lg">
                                    <span>الإجمالي</span>
                                    <span>{formatPrice(order.total)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {order.notes && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Info size={20} />
                                    ملاحظات العميل
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="bg-amber-50 p-4 border border-amber-200 rounded text-amber-900">
                                    {order.notes}
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Right: Customer & Status */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Phone size={20} />
                                العميل
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label className="text-muted-foreground">الاسم الكامل</Label>
                                <p className="font-medium">{order.customer_name}</p>
                            </div>
                            <div>
                                <Label className="text-muted-foreground">رقم الهاتف</Label>
                                <div className="flex items-center justify-between">
                                    <p className="font-medium" dir="ltr">{order.customer_phone}</p>
                                    <div className="flex gap-2">
                                        <a href={`tel:${order.customer_phone}`}>
                                            <Button size="icon" variant="outline" title="اتصال">
                                                <Phone size={16} />
                                            </Button>
                                        </a>
                                        <a
                                            href={`https://wa.me/${order.customer_phone?.replace(/\D/g, '')}`}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            <Button size="icon" variant="outline" className="text-green-600 hover:text-green-700 hover:bg-green-50" title="واتساب">
                                                <MessageCircle size={16} />
                                            </Button>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MapPin size={20} />
                                العنوان
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label className="text-muted-foreground">المحافظة</Label>
                                <p className="font-medium">{order.governorates?.name}</p>
                            </div>
                            <div>
                                <Label className="text-muted-foreground">المنطقة</Label>
                                <p className="font-medium">{order.area}</p>
                            </div>
                            {order.nearest_landmark && (
                                <div>
                                    <Label className="text-muted-foreground">أقرب نقطة دالة</Label>
                                    <p className="font-medium">{order.nearest_landmark}</p>
                                </div>
                            )}

                            {order.map_url && (
                                <div className="pt-2">
                                    <Label className="text-muted-foreground block mb-2">موقع الخريطة</Label>
                                    <div className="flex flex-col gap-2">
                                        <a
                                            href={order.map_url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="w-full"
                                        >
                                            <Button variant="outline" className="w-full gap-2 text-blue-600 border-blue-200 bg-blue-50 hover:bg-blue-100">
                                                <MapPin size={16} />
                                                فتح في الخرائط
                                            </Button>
                                        </a>

                                        <a
                                            href={`https://wa.me/?text=${encodeURIComponent(`رابط موقع التوصيل للطلب #${order.order_number}: ${order.map_url}`)}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="w-full"
                                        >
                                            <Button variant="outline" className="w-full gap-2 text-green-600 border-green-200 bg-green-50 hover:bg-green-100">
                                                <MessageCircle size={16} />
                                                مشاركة الموقع مع المندوب
                                            </Button>
                                        </a>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="border-primary/20 bg-primary/5">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Truck size={20} />
                                تعيين مندوب (اختياري)
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Select
                                value={order.agent_id || "unassigned"}
                                onValueChange={(val) => updateAgent.mutate(val === "unassigned" ? null : val)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="اختر مندوباً" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="unassigned">غير محدد</SelectItem>
                                    {agents?.map((agent) => (
                                        <SelectItem key={agent.id} value={agent.id}>
                                            {agent.full_name || agent.email}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-muted-foreground">سيتمكن المندوب من رؤية هذا الطلب في حسابه الخاص</p>
                        </CardContent>
                    </Card>

                    <Card className="border-primary/20 bg-primary/5">
                        <CardHeader>
                            <CardTitle>تحديث الحالة</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Select defaultValue={order.status || "new"} onValueChange={(val) => updateStatus.mutate(val)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(statusMap).map(([val, { label }]) => (
                                        <SelectItem key={val} value={val}>{label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-muted-foreground">سيتم حفظ التغيير فوراً عند الاختيار</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-green-700">
                                <MessageCircle size={20} />
                                إشعارات واتساب (سريع)
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button
                                variant="outline"
                                className="w-full text-xs justify-start gap-2 border-green-200 hover:bg-green-50"
                                onClick={() => {
                                    const msg = `أهلاً ${order.customer_name}، شكراً لطلبك من منجور. تم تأكيد طلبك رقم (#${order.order_number}) وجاري التجهيز.`;
                                    window.open(`https://wa.me/${order.customer_phone?.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
                                }}
                            >
                                <Badge variant="outline" className="text-[10px] bg-blue-50">1</Badge>
                                تأكيد الطلب
                            </Button>

                            <Button
                                variant="outline"
                                className="w-full text-xs justify-start gap-2 border-green-200 hover:bg-green-50"
                                onClick={() => {
                                    const msg = `زبوننا العزيز، طلبك رقم (#${order.order_number}) مع المندوب الآن. سيتم التواصل معك قريباً للتوصيل. ${order.map_url ? `موقعك: ${order.map_url}` : ""}`;
                                    window.open(`https://wa.me/${order.customer_phone?.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
                                }}
                            >
                                <Badge variant="outline" className="text-[10px] bg-amber-50">2</Badge>
                                إشعار خروج المندوب
                            </Button>

                            <Button
                                variant="outline"
                                className="w-full text-xs justify-start gap-2 border-green-200 hover:bg-green-50"
                                onClick={() => {
                                    const msg = `تم توصيل طلبك رقم (#${order.order_number}) بنجاح. شكراً لثقتك بمنجور. نتمنى لك تجربة سعيدة!`;
                                    window.open(`https://wa.me/${order.customer_phone?.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
                                }}
                            >
                                <Badge variant="outline" className="text-[10px] bg-green-50">3</Badge>
                                شكر بعد التوصيل
                            </Button>
                            <p className="text-[10px] text-muted-foreground text-center">سيتم فتح واتساب برسالة جاهزة</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>ملاحظات إدارية</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <textarea
                                className="w-full min-h-[100px] p-2 text-sm border rounded bg-background"
                                placeholder="أضف ملاحظات داخلية هنا..."
                                defaultValue={order.admin_notes || ""}
                                onBlur={(e) => updateNotes.mutate(e.target.value)}
                            />
                            <p className="text-[10px] text-muted-foreground">يتم الحفظ تلقائياً عند الابتعاد عن الحقل</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
