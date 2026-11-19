import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Truck, Plus, Edit, Coins, Save } from "lucide-react";
import { formatPrice } from "@/lib/format";

export default function AdminDelivery() {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editingCompany, setEditingCompany] = useState<any>(null);
    const [isPriceOpen, setIsPriceOpen] = useState(false);
    const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
    const queryClient = useQueryClient();

    // Fetch Companies
    const { data: companies, isLoading } = useQuery({
        queryKey: ["delivery-companies"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("delivery_companies")
                .select("*")
                .order("created_at", { ascending: false });
            if (error) throw error;
            return data;
        },
    });

    // Fetch Governorates
    const { data: governorates } = useQuery({
        queryKey: ["governorates"],
        queryFn: async () => {
            const { data } = await supabase.from("governorates").select("*").order("name");
            return data;
        }
    });

    // Fetch Prices for selected company
    const { data: prices, refetch: refetchPrices } = useQuery({
        queryKey: ["delivery-prices", selectedCompanyId],
        queryFn: async () => {
            if (!selectedCompanyId) return [];
            const { data } = await supabase
                .from("delivery_prices")
                .select("*")
                .eq("company_id", selectedCompanyId);
            return data || [];
        },
        enabled: !!selectedCompanyId
    });

    const createCompany = useMutation({
        mutationFn: async (data: { name: string, phone: string }) => {
            const { error } = await supabase.from("delivery_companies").insert(data);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["delivery-companies"] });
            setIsAddOpen(false);
            toast.success("تمت إضافة شركة التوصيل");
        },
    });

    const updatePrice = useMutation({
        mutationFn: async ({ governorateId, price }: { governorateId: string, price: number }) => {
            if (!selectedCompanyId) return;

            // Check if price exists
            const existing = prices?.find(p => p.governorate_id === governorateId);

            if (existing) {
                const { error } = await supabase
                    .from("delivery_prices")
                    .update({ price })
                    .eq("id", existing.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from("delivery_prices")
                    .insert({
                        company_id: selectedCompanyId,
                        governorate_id: governorateId,
                        price
                    });
                if (error) throw error;
            }
        },
        onSuccess: () => {
            refetchPrices();
            toast.success("تم تحديث السعر");
        }
    });

    const [tempPrices, setTempPrices] = useState<Record<string, number>>({});

    const handlePriceChange = (govId: string, val: string) => {
        setTempPrices(prev => ({ ...prev, [govId]: parseInt(val) || 0 }));
    };

    const savePrice = (govId: string) => {
        const price = tempPrices[govId];
        if (price !== undefined) {
            updatePrice.mutate({ governorateId: govId, price });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">إعدادات التوصيل</h1>
                    <p className="text-muted-foreground">إدارة شركات التوصيل وأسعار الشحن للمحافظات</p>
                </div>
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus size={16} />
                            إضافة شركة
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>إضافة شركة توصيل جديدة</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={(e: any) => {
                            e.preventDefault();
                            createCompany.mutate({
                                name: e.target.name.value,
                                phone: e.target.phone.value
                            });
                        }} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">اسم الشركة</Label>
                                <Input id="name" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">رقم الهاتف (للتواصل)</Label>
                                <Input id="phone" />
                            </div>
                            <Button type="submit" className="w-full">حفظ</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    <div>جاري التحميل...</div>
                ) : companies?.length === 0 ? (
                    <div className="col-span-full text-center py-10 text-muted-foreground">لا توجد شركات توصيل مضافة</div>
                ) : (
                    companies?.map((company) => (
                        <Card key={company.id} className="relative group">
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <div className="bg-primary/10 p-2 rounded-full">
                                        <Truck className="h-6 w-6 text-primary" />
                                    </div>
                                    <Dialog open={isPriceOpen && selectedCompanyId === company.id} onOpenChange={(open) => {
                                        setIsPriceOpen(open);
                                        if (!open) setSelectedCompanyId(null);
                                    }}>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" size="sm" className="gap-2" onClick={() => setSelectedCompanyId(company.id)}>
                                                <Coins size={14} />
                                                تسعير المحافظات
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                                            <DialogHeader>
                                                <DialogTitle>تحديد أسعار التوصيل - {company.name}</DialogTitle>
                                                <CardDescription>حدد سعر التوصيل لكل محافظة لهذه الشركة</CardDescription>
                                            </DialogHeader>
                                            <div className="py-4 overflow-x-auto">
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead>المحافظة</TableHead>
                                                            <TableHead>السعر الحالي</TableHead>
                                                            <TableHead>تعديل السعر</TableHead>
                                                            <TableHead></TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {governorates?.map((gov) => {
                                                            const priceObj = prices?.find(p => p.governorate_id === gov.id);
                                                            const currentPrice = priceObj ? priceObj.price : 5000; // Default

                                                            return (
                                                                <TableRow key={gov.id}>
                                                                    <TableCell className="font-medium">{gov.name}</TableCell>
                                                                    <TableCell>{formatPrice(currentPrice)}</TableCell>
                                                                    <TableCell>
                                                                        <Input
                                                                            type="number"
                                                                            placeholder="أدخل السعر"
                                                                            className="w-32 h-8"
                                                                            defaultValue={currentPrice}
                                                                            onChange={(e) => handlePriceChange(gov.id, e.target.value)}
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Button
                                                                            size="icon"
                                                                            variant="ghost"
                                                                            onClick={() => savePrice(gov.id)}
                                                                        >
                                                                            <Save size={16} className="text-primary" />
                                                                        </Button>
                                                                    </TableCell>
                                                                </TableRow>
                                                            );
                                                        })}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                                <CardTitle className="mt-4">{company.name}</CardTitle>
                                <CardDescription>{company.phone || "لا يوجد رقم هاتف"}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between text-sm text-muted-foreground mt-2">
                                    <span>الحالة: <span className={company.is_active ? "text-green-600 font-bold" : "text-gray-500"}>{company.is_active ? "نشط" : "غير نشط"}</span></span>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
