import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Search, Plus, Edit, Trash2, ExternalLink } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function AdminProducts() {
    const [searchTerm, setSearchTerm] = useState("");
    const queryClient = useQueryClient();

    const { data: products, isLoading } = useQuery({
        queryKey: ["admin-products"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("products")
                .select(`
          *,
          categories(name)
        `)
                .order("created_at", { ascending: false });

            if (error) throw error;
            return data;
        }
    });

    const deleteProduct = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from("products").delete().eq("id", id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-products"] });
            toast.success("تم حذف المنتج");
        },
        onError: () => toast.error("حدث خطأ أثناء الحذف"),
    });

    const filteredProducts = products?.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
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
                <Link to="/admin/products/new">
                    <Button className="gap-2 w-full md:w-auto">
                        <Plus size={18} />
                        إضافة منتج جديد
                    </Button>
                </Link>
            </div>

            <div className="bg-card rounded-lg border border-border overflow-hidden overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-right">المنتج</TableHead>
                            <TableHead className="text-right">القسم</TableHead>
                            <TableHead className="text-right">السعر</TableHead>
                            <TableHead className="text-right">المخزون</TableHead>
                            <TableHead className="text-right">الحالة</TableHead>
                            <TableHead className="text-center">إجراءات</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">جاري التحميل...</TableCell>
                            </TableRow>
                        ) : filteredProducts?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">لا توجد منتجات</TableCell>
                            </TableRow>
                        ) : filteredProducts?.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={product.images?.[0] || "/placeholder.svg"}
                                            alt={product.name}
                                            className="w-10 h-10 rounded object-cover border"
                                        />
                                        <div className="font-medium">{product.name}</div>
                                    </div>
                                </TableCell>
                                <TableCell>{(product.categories as any)?.name}</TableCell>
                                <TableCell>
                                    {product.discount_price ? (
                                        <div className="flex flex-col">
                                            <span className="font-bold">{formatPrice(product.discount_price)}</span>
                                            <span className="text-xs text-muted-foreground line-through">{formatPrice(product.price)}</span>
                                        </div>
                                    ) : (
                                        <span className="font-bold">{formatPrice(product.price)}</span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Badge variant={Number(product.stock) > 5 ? "outline" : "destructive"}>
                                        {product.stock}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge className={product.is_active ? "bg-green-500" : "bg-gray-400"}>
                                        {product.is_active ? "نشط" : "معطل"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-center">
                                    <div className="flex items-center justify-center gap-1">
                                        <Link to={`/product/${product.slug}`} target="_blank">
                                            <Button variant="ghost" size="icon">
                                                <ExternalLink size={18} />
                                            </Button>
                                        </Link>
                                        <Link to={`/admin/products/${product.id}/edit`}>
                                            <Button variant="ghost" size="icon">
                                                <Edit size={18} />
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-destructive hover:text-destructive"
                                            onClick={() => {
                                                if (confirm("هل أنت متأكد من حذف هذا المنتج؟")) {
                                                    deleteProduct.mutate(product.id);
                                                }
                                            }}
                                        >
                                            <Trash2 size={18} />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
