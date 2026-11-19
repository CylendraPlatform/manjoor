import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Plus, Trash2, Edit } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { formatPrice } from "@/lib/format";
import { Badge } from "@/components/ui/badge";

export default function AdminCoupons() {
    const [isOpen, setIsOpen] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState<any>(null);

    // Controlled form state
    const [formData, setFormData] = useState({
        code: "",
        discount_type: "fixed",
        value: "",
        min_order_amount: "",
        max_uses: "",
        expires_at: "",
        is_active: true
    });

    const queryClient = useQueryClient();

    const { data: coupons, isLoading } = useQuery({
        queryKey: ["admin-coupons"],
        queryFn: async () => {
            const { data, error } = await supabase.from("coupons").select("*").order("created_at", { ascending: false });
            if (error) throw error;
            return data;
        },
    });

    // Reset form when dialog opens/closes or editing changes
    useEffect(() => {
        if (editingCoupon) {
            setFormData({
                code: editingCoupon.code,
                discount_type: editingCoupon.discount_type,
                value: (editingCoupon.discount_value ?? editingCoupon.value ?? 0).toString(),
                min_order_amount: editingCoupon.min_order_amount?.toString() || "",
                max_uses: editingCoupon.max_uses?.toString() || "",
                expires_at: editingCoupon.expires_at ? format(new Date(editingCoupon.expires_at), "yyyy-MM-dd'T'HH:mm") : "",
                is_active: editingCoupon.is_active
            });
        } else {
            setFormData({
                code: "",
                discount_type: "fixed",
                value: "",
                min_order_amount: "",
                max_uses: "",
                expires_at: "",
                is_active: true
            });
        }
    }, [editingCoupon, isOpen]);

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from("coupons").delete().eq("id", id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
            toast.success("تم حذف الكوبون");
        },
        onError: (error: any) => {
            toast.error("فشل الحذف: " + error.message);
        }
    });

    const saveMutation = useMutation({
        mutationFn: async (data: any) => {
            // Prepare payload
            const payload: any = {
                code: data.code.toUpperCase().trim(),
                discount_type: data.discount_type,
                value: parseFloat(data.value), // Reverting to 'value' as per migration
                min_order_amount: data.min_order_amount ? parseFloat(data.min_order_amount) : 0,
                max_uses: data.max_uses ? parseInt(data.max_uses) : null,
                expires_at: data.expires_at ? new Date(data.expires_at).toISOString() : null,
                is_active: data.is_active,
            };

            if (editingCoupon) {
                const { error } = await supabase.from("coupons").update(payload).eq("id", editingCoupon.id);
                if (error) throw error;
            } else {
                const { error } = await supabase.from("coupons").insert(payload);
                if (error) throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
            setIsOpen(false);
            setEditingCoupon(null);
            toast.success(editingCoupon ? "تم تحديث الكوبون" : "تمت إضافة الكوبون");
        },
        onError: (error: any) => {
            console.error("Coupon save error:", error);
            toast.error("حدث خطأ: " + (error.message || "تأكد من صحة البيانات (الكود يجب أن يكون فريداً)"));
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        saveMutation.mutate(formData);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">إدارة الكوبونات</h1>
                    <p className="text-muted-foreground">إنشاء وتعديل كوبونات الخصم والعروض الترويجية</p>
                </div>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => setEditingCoupon(null)} className="gap-2">
                            <Plus size={16} />
                            كوبون جديد
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingCoupon ? "تعديل الكوبون" : "إضافة كوبون جديد"}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="code">كود الكوبون</Label>
                                <Input
                                    id="code"
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                    required
                                    placeholder="مثال: SUMMER2026"
                                    className="uppercase"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="discount_type">نوع الخصم</Label>
                                    <Select
                                        value={formData.discount_type}
                                        onValueChange={(val) => setFormData({ ...formData, discount_type: val })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="fixed">مبلغ ثابت</SelectItem>
                                            <SelectItem value="percentage">نسبة مئوية %</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="value">قيمة الخصم</Label>
                                    <Input
                                        id="value"
                                        type="number"
                                        value={formData.value}
                                        onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                                        required
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="min_order_amount">الحد الأدنى للطلب (اختياري)</Label>
                                <Input
                                    id="min_order_amount"
                                    type="number"
                                    value={formData.min_order_amount}
                                    onChange={(e) => setFormData({ ...formData, min_order_amount: e.target.value })}
                                    min="0"
                                    placeholder="0"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="max_uses">أقصى عدد للاستخدام (اختياري)</Label>
                                <Input
                                    id="max_uses"
                                    type="number"
                                    value={formData.max_uses}
                                    onChange={(e) => setFormData({ ...formData, max_uses: e.target.value })}
                                    min="1"
                                    placeholder="غير محدود"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="expires_at">تاريخ الانتهاء</Label>
                                <Input
                                    id="expires_at"
                                    type="datetime-local"
                                    value={formData.expires_at}
                                    onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                                />
                            </div>

                            <div className="flex items-center space-x-2 space-x-reverse pt-2">
                                <Switch
                                    id="is_active"
                                    checked={formData.is_active}
                                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                                />
                                <Label htmlFor="is_active">الكوبون نشط</Label>
                            </div>

                            <Button type="submit" className="w-full mt-4" disabled={saveMutation.isPending}>
                                {saveMutation.isPending ? "جاري الحفظ..." : "حفظ"}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardContent className="p-0 overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-right">الكود</TableHead>
                                <TableHead className="text-right">الخصم</TableHead>
                                <TableHead className="text-right">الاستخدام</TableHead>
                                <TableHead className="text-right">انتهاء الصلاحية</TableHead>
                                <TableHead className="text-right">الحالة</TableHead>
                                <TableHead className="text-center">إجراءات</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8">جاري التحميل...</TableCell>
                                </TableRow>
                            ) : coupons?.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">لا توجد كوبونات</TableCell>
                                </TableRow>
                            ) : (
                                coupons?.map((coupon: any) => (
                                    <TableRow key={coupon.id}>
                                        <TableCell className="font-bold font-mono text-primary">{coupon.code}</TableCell>
                                        <TableCell>
                                            {coupon.discount_type === 'percentage'
                                                ? `${coupon.discount_value ?? coupon.value ?? 0}%`
                                                : formatPrice(coupon.discount_value ?? coupon.value)}
                                        </TableCell>
                                        <TableCell>
                                            {coupon.used_count} / {coupon.max_uses || "∞"}
                                        </TableCell>
                                        <TableCell>
                                            {coupon.expires_at ? format(new Date(coupon.expires_at), 'yyyy/MM/dd', { locale: ar }) : "مفتوح"}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={coupon.is_active ? "default" : "secondary"}>
                                                {coupon.is_active ? "نشط" : "غير نشط"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-center space-x-2 space-x-reverse">
                                            <Button variant="ghost" size="icon" onClick={() => {
                                                setEditingCoupon(coupon);
                                                setIsOpen(true);
                                            }}>
                                                <Edit size={16} />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => {
                                                if (confirm("هل أنت متأكد من حذف هذا الكوبون؟")) {
                                                    deleteMutation.mutate(coupon.id);
                                                }
                                            }}>
                                                <Trash2 size={16} />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
