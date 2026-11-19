import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowRight, Save, Upload, X } from "lucide-react";

export default function AdminProductForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const isEdit = !!id;

    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState<string[]>([]);
    const [form, setForm] = useState({
        name: "",
        slug: "",
        description: "",
        price: "",
        discount_price: "",
        category_id: "",
        stock: "0",
        purchase_price: "0",
        low_stock_threshold: "5",
        is_active: true,
        is_featured: false,
        is_new: false,
        is_best_seller: false,
        offer_ends_at: "",
        loyalty_points_enabled: true,
    });

    const { data: categories } = useQuery({
        queryKey: ["admin-categories-list"],
        queryFn: async () => {
            const { data } = await supabase.from("categories").select("*").order("name");
            return data ?? [];
        },
    });

    const { data: product } = useQuery({
        queryKey: ["admin-product-edit", id],
        queryFn: async () => {
            if (!id) return null;
            const { data } = await supabase.from("products").select("*").eq("id", id).single();
            return data;
        },
        enabled: isEdit,
    });

    useEffect(() => {
        if (product) {
            setForm({
                name: product.name,
                slug: product.slug,
                description: product.description || "",
                price: product.price.toString(),
                discount_price: product.discount_price?.toString() || "",
                category_id: product.category_id || "",
                stock: product.stock?.toString() || "0",
                purchase_price: (product as any).purchase_price?.toString() || "0",
                low_stock_threshold: (product as any).low_stock_threshold?.toString() || "5",
                is_active: (product as any).is_active ?? true,
                is_featured: (product as any).is_featured ?? false,
                is_new: (product as any).is_new ?? false,
                is_best_seller: (product as any).is_best_seller ?? false,
                offer_ends_at: (product as any).offer_ends_at ? new Date((product as any).offer_ends_at).toISOString().slice(0, 16) : "",
                loyalty_points_enabled: (product as any).loyalty_points_enabled ?? true,
            });
            setImages(product.images || []);
        }
    }, [product]);

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^\w\s\u0600-\u06FF]/g, "")
            .replace(/\s+/g, "-");
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setForm(prev => ({
            ...prev,
            name: val,
            slug: isEdit ? prev.slug : generateSlug(val)
        }));
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `products/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('products')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('products')
                .getPublicUrl(filePath);

            setImages(prev => [...prev, publicUrl]);
            toast.success("تم رفع الصورة بنجاح");
        } catch (error: any) {
            toast.error(error.message || "خطأ أثناء الرفع");
        } finally {
            setLoading(false);
        }
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            name: form.name,
            slug: form.slug,
            description: form.description,
            price: parseFloat(form.price),
            discount_price: form.discount_price ? parseFloat(form.discount_price) : null,
            category_id: form.category_id || null,
            stock: parseInt(form.stock),
            purchase_price: parseFloat(form.purchase_price),
            low_stock_threshold: parseInt(form.low_stock_threshold),
            is_active: form.is_active,
            is_featured: form.is_featured,
            is_new: form.is_new,
            is_best_seller: form.is_best_seller,
            offer_ends_at: form.offer_ends_at || null,
            images,
            loyalty_points_enabled: form.loyalty_points_enabled,
        };

        try {
            let error;
            if (isEdit) {
                ({ error } = await supabase.from("products").update(payload).eq("id", id));
            } else {
                ({ error } = await supabase.from("products").insert(payload));
            }

            if (error) throw error;

            toast.success(isEdit ? "تم تحديث المنتج" : "تمت إضافة المنتج");
            queryClient.invalidateQueries({ queryKey: ["admin-products"] });
            navigate("/admin/products");
        } catch (error: any) {
            toast.error(error.message || "حدث خطأ");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl mx-auto">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" type="button" onClick={() => navigate(-1)}>
                    <ArrowRight size={20} />
                </Button>
                <h2 className="text-2xl font-bold">{isEdit ? "تعديل المنتج" : "منتج جديد"}</h2>
                <Button className="mr-auto gap-2" disabled={loading} type="submit">
                    <Save size={18} />
                    {isEdit ? "حفظ التغييرات" : "إضافة المنتج"}
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>المعلومات الأساسية</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">اسم المنتج *</Label>
                                <Input id="name" value={form.name} onChange={handleNameChange} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="slug">الرابط (Slug) *</Label>
                                <Input id="slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required dir="ltr" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">وصف المنتج</Label>
                                <Textarea id="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={5} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>الصور</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                                {images.map((img, idx) => (
                                    <div key={idx} className="relative aspect-square rounded border overflow-hidden group">
                                        <img src={img} className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(idx)}
                                            className="absolute top-1 right-1 bg-destructive text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                                <label className="aspect-square border-2 border-dashed rounded flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted/50 transition-colors">
                                    <Upload className="text-muted-foreground" size={24} />
                                    <span className="text-xs text-muted-foreground">رفع صورة</span>
                                    <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={loading} />
                                </label>
                            </div>
                            <p className="text-xs text-muted-foreground">ملاحظة: الصورة الأولى ستكون الصورة الرئيسية للمنتج</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>التسعير والمخزون</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="price">السعر الأساسي (للبيع) *</Label>
                                <Input id="price" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required dir="ltr" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="purchase_price">سعر الشراء (التكلفة) *</Label>
                                <Input id="purchase_price" type="number" value={form.purchase_price} onChange={(e) => setForm({ ...form, purchase_price: e.target.value })} required dir="ltr" />
                                <p className="text-[10px] text-muted-foreground italic">يُستخدم لحساب صافي الأرباح في التقارير</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="discount_price">سعر الخصم (اختياري)</Label>
                                <Input id="discount_price" type="number" value={form.discount_price} onChange={(e) => setForm({ ...form, discount_price: e.target.value })} dir="ltr" />
                            </div>
                            <div className="space-y-4 pt-2 border-t border-border mt-2">
                                <div className="space-y-2">
                                    <Label htmlFor="stock">الكمية المتوفرة</Label>
                                    <Input id="stock" type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} dir="ltr" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="low_stock_threshold">حد التنبيه (Low Stock) *</Label>
                                    <Input id="low_stock_threshold" type="number" value={form.low_stock_threshold} onChange={(e) => setForm({ ...form, low_stock_threshold: e.target.value })} required dir="ltr" />
                                </div>
                            </div>
                            <div className="space-y-2 border-t border-border pt-2">
                                <Label htmlFor="offer_ends_at">تاريخ انتهاء العرض (اختياري)</Label>
                                <Input
                                    id="offer_ends_at"
                                    type="datetime-local"
                                    value={form.offer_ends_at}
                                    onChange={(e) => setForm({ ...form, offer_ends_at: e.target.value })}
                                    dir="ltr"
                                    className="block"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>التصنيف والحالة</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label>القسم</Label>
                                <Select value={form.category_id} onValueChange={(v) => setForm({ ...form, category_id: v })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="اختر القسم" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories?.filter(c => !c.parent_id).map((root) => (
                                            <div key={root.id}>
                                                <SelectItem value={root.id} className="font-bold text-primary">
                                                    {root.name}
                                                </SelectItem>
                                                {categories?.filter(c => c.parent_id === root.id).map(child => (
                                                    <SelectItem key={child.id} value={child.id} className="pr-6 text-sm">
                                                        ↳ {child.name}
                                                    </SelectItem>
                                                ))}
                                            </div>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="is_active">المنتج نشط؟</Label>
                                    <Switch id="is_active" checked={form.is_active} onCheckedChange={(val) => setForm({ ...form, is_active: val })} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="is_featured">منتج مميز؟</Label>
                                    <Switch id="is_featured" checked={form.is_featured} onCheckedChange={(val) => setForm({ ...form, is_featured: val })} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="is_best_seller">الأكثر مبيعاً؟</Label>
                                    <Switch id="is_best_seller" checked={form.is_best_seller} onCheckedChange={(val) => setForm({ ...form, is_best_seller: val })} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="is_new">وصل حديثاً؟</Label>
                                    <Switch id="is_new" checked={form.is_new} onCheckedChange={(val) => setForm({ ...form, is_new: val })} />
                                </div>
                                <div className="flex items-center justify-between pt-4 border-t border-dashed">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="loyalty_points_enabled">تفعيل نقاط الولاء</Label>
                                        <p className="text-[10px] text-muted-foreground">منح الزبون نقاط عند شراء هذا المنتج</p>
                                    </div>
                                    <Switch id="loyalty_points_enabled" checked={form.loyalty_points_enabled} onCheckedChange={(val) => setForm({ ...form, loyalty_points_enabled: val })} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </form>
    );
}
