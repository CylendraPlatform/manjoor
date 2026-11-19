import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, AlertTriangle, ArrowUpRight, History, Package } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminInventory() {
    const [searchTerm, setSearchTerm] = useState("");
    const [showOnlyLowStock, setShowOnlyLowStock] = useState(false);
    const queryClient = useQueryClient();

    const { data: products, isLoading } = useQuery({
        queryKey: ["admin-inventory"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("products")
                .select("*, categories(name)")
                .order("stock", { ascending: true });

            if (error) throw error;
            return data;
        }
    });

    const updateStock = useMutation({
        mutationFn: async ({ id, newStock, reason }: { id: string, newStock: number, reason: string }) => {
            // Atomic server-side stock adjustment + movement log.
            // Requires isolated Bounty P0 migration; no direct stock writes.
            const { error } = await supabase.rpc("bounty_adjust_stock" as never, {
                p_product_id: id, p_new_stock: newStock, p_reason: reason || "تحديث يدوي"
            } as never);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-inventory"] });
            toast.success("تم تحديث المخزون");
        },
        onError: (error) => {
            console.error(error);
            toast.error("حدث خطأ أثناء التحديث");
        }
    });

    const filteredProducts = products?.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        const isLow = p.stock <= (p.low_stock_threshold || 5);
        if (showOnlyLowStock) return matchesSearch && isLow;
        return matchesSearch;
    });

    const stats = {
        totalItems: products?.length || 0,
        lowStockItems: products?.filter(p => p.stock <= (p.low_stock_threshold || 5)).length || 0,
        outOfStock: products?.filter(p => p.stock <= 0).length || 0,
        totalSold: products?.reduce((acc, p) => acc + (p.sold_count || 0), 0) || 0
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="py-4">
                        <CardTitle className="text-sm font-medium text-muted-foreground">إجمالي المنتجات</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalItems}</div>
                    </CardContent>
                </Card>
                <Card className={stats.lowStockItems > 0 ? "border-amber-500 bg-amber-50" : ""}>
                    <CardHeader className="py-4">
                        <CardTitle className="text-sm font-medium text-muted-foreground">مخزون منخفض</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-amber-600">{stats.lowStockItems}</div>
                    </CardContent>
                </Card>
                <Card className={stats.outOfStock > 0 ? "border-destructive bg-destructive/5" : ""}>
                    <CardHeader className="py-4">
                        <CardTitle className="text-sm font-medium text-muted-foreground">نفذت الكمية</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-destructive">{stats.outOfStock}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="py-4">
                        <CardTitle className="text-sm font-medium text-muted-foreground">إجمالي المبيعات</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-primary">{stats.totalSold}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 max-w-sm w-full">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input
                        placeholder="بحث عن منتج..."
                        className="pr-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <Button
                        variant={showOnlyLowStock ? "destructive" : "outline"}
                        onClick={() => setShowOnlyLowStock(!showOnlyLowStock)}
                        className="gap-2"
                    >
                        <AlertTriangle size={18} />
                        نقص المخزون فقط
                    </Button>
                </div>
            </div>

            <div className="bg-card rounded-lg border border-border overflow-hidden overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-right">المنتج</TableHead>
                            <TableHead className="text-right">القسم</TableHead>
                            <TableHead className="text-center">المباع</TableHead>
                            <TableHead className="text-center">المتبقي</TableHead>
                            <TableHead className="text-center">الحد الأدنى</TableHead>
                            <TableHead className="text-right">الحالة</TableHead>
                            <TableHead className="text-center">إجراءات</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">جاري التحميل...</TableCell>
                            </TableRow>
                        ) : filteredProducts?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">لا توجد منتجات مطابقة</TableCell>
                            </TableRow>
                        ) : filteredProducts?.map((product) => {
                            const isLow = product.stock <= (product.low_stock_threshold || 5);
                            return (
                                <TableRow key={product.id}>
                                    <TableCell>
                                        <div className="font-medium">{product.name}</div>
                                        <div className="text-xs text-muted-foreground">{product.slug}</div>
                                    </TableCell>
                                    <TableCell>{(product.categories as { name: string } | null)?.name}</TableCell>
                                    <TableCell className="text-center font-bold text-primary">
                                        {product.sold_count || 0}
                                    </TableCell>
                                    <TableCell className="text-center font-bold">
                                        <span className={isLow ? "text-destructive" : ""}>{product.stock}</span>
                                    </TableCell>
                                    <TableCell className="text-center text-muted-foreground">
                                        {product.low_stock_threshold || 5}
                                    </TableCell>
                                    <TableCell>
                                        {product.stock <= 0 ? (
                                            <Badge variant="destructive">منتهي</Badge>
                                        ) : isLow ? (
                                            <Badge variant="outline" className="text-amber-600 border-amber-600">منخفض</Badge>
                                        ) : (
                                            <Badge variant="outline" className="text-green-600 border-green-600">متوفر</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    const amount = prompt("أدخل الكمية الجديدة:");
                                                    if (amount !== null && !isNaN(parseInt(amount))) {
                                                        updateStock.mutate({
                                                            id: product.id,
                                                            newStock: parseInt(amount),
                                                            reason: 'تعديل سريع في صفحة المخزون'
                                                        });
                                                    }
                                                }}
                                            >
                                                تعديل
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
