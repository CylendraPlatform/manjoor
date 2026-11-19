import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Search, Eye, Download, Truck, Calendar, Plus } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import ManualOrderModal from "@/components/admin/ManualOrderModal";

const statusMap: Record<string, { label: string, color: string }> = {
    new: { label: "جديد", color: "bg-blue-500" },
    contacted: { label: "تم التواصل", color: "bg-purple-500" },
    preparing: { label: "قيد التجهيز", color: "bg-amber-500" },
    shipped: { label: "تم الشحن", color: "bg-indigo-500" },
    delivered: { label: "تم التوصيل", color: "bg-green-500" },
    cancelled: { label: "ملغي", color: "bg-destructive" },
    returned: { label: "مرجع", color: "bg-gray-500" },
};

export default function AdminOrders() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [deliveryFilter, setDeliveryFilter] = useState("all");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [manualOrderOpen, setManualOrderOpen] = useState(false);
    const queryClient = useQueryClient();

    // Fetch Delivery Companies
    const { data: deliveryCompanies } = useQuery({
        queryKey: ["delivery-companies-list"],
        queryFn: async () => {
            const { data } = await supabase.from("delivery_companies").select("id, name");
            return data || [];
        }
    });

    const { data: orders, isLoading } = useQuery({
        queryKey: ["admin-orders", statusFilter, deliveryFilter, fromDate, toDate],
        queryFn: async () => {
            let query = supabase
                .from("orders")
                .select(`
          *,
          governorates(name),
          delivery_companies(id, name)
        `)
                .order("created_at", { ascending: false });

            if (statusFilter !== "all") {
                query = query.eq("status", statusFilter);
            }

            if (deliveryFilter !== "all") {
                if (deliveryFilter === "none") {
                    query = query.is("delivery_company_id", null);
                } else {
                    query = query.eq("delivery_company_id", deliveryFilter);
                }
            }

            if (fromDate) {
                query = query.gte("created_at", `${fromDate}T00:00:00`);
            }

            if (toDate) {
                query = query.lte("created_at", `${toDate}T23:59:59`);
            }

            const { data, error } = await query;
            if (error) throw error;
            return data;
        }
    });

    const assignDelivery = useMutation({
        mutationFn: async ({ orderId, companyId }: { orderId: string, companyId: string | null }) => {
            const { error } = await supabase
                .from("orders")
                .update({ delivery_company_id: companyId })
                .eq("id", orderId);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
            toast.success("تم تحديث شركة التوصيل");
        },
        onError: () => {
            toast.error("حدث خطأ أثناء التحديث");
        }
    });

    const filteredOrders = orders?.filter(order => {
        const matchesSearch =
            order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customer_phone.includes(searchTerm) ||
            order.order_number.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesSearch;
    });

    const exportToCSV = () => {
        if (!filteredOrders || filteredOrders.length === 0) {
            toast.error("لا توجد بيانات للتصدير");
            return;
        }

        // CSV Header optimized for delivery companies
        const headers = [
            "#",
            "رقم الوصل",
            "اسم العميل",
            "رقم الهاتف",
            "المحافظة",
            "العنوان الكامل",
            "مبلغ الوصل",
            "الملاحظات",
            "شركة التوصيل"
        ];

        const rows = filteredOrders.map((o, index) => [
            index + 1,
            o.order_number,
            o.customer_name,
            o.customer_phone,
            o.governorates?.name || '',
            `${o.area || ''} - ${o.nearest_landmark || ''}`,
            o.total,
            o.notes || '',
            (o.delivery_companies as any)?.name || 'غير محدد'
        ]);

        // Add BOM for Excel compatibility (UTF-8)
        const BOM = "\uFEFF";
        const csvContent = BOM + [headers, ...rows]
            .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
            .join("\n");

        // Create download link
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        const fileName = `Delivery_Sheet_${format(new Date(), 'yyyy-MM-dd_HH-mm')}.csv`;
        link.download = fileName;
        link.click();

        toast.success("تم تصدير الملف بنجاح");
    };

    return (
        <div className="space-y-6">
            {/* Filters Header */}
            <div className="flex flex-col xl:flex-row gap-4 items-end xl:items-center justify-between bg-card p-4 rounded-lg border border-border shadow-sm">
                <div className="flex flex-wrap gap-3 items-center flex-1 w-full">

                    {/* Search */}
                    <div className="relative flex-1 min-w-[200px] max-w-xs">
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                        <Input
                            placeholder="بحث (اسم، هاتف، رقم طلب)..."
                            className="pr-9 h-9"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Status Filter */}
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[140px] h-9">
                            <SelectValue placeholder="الحالة" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">كل الحالات</SelectItem>
                            {Object.entries(statusMap).map(([val, { label }]) => (
                                <SelectItem key={val} value={val}>{label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Delivery Filter */}
                    <Select value={deliveryFilter} onValueChange={setDeliveryFilter}>
                        <SelectTrigger className="w-[160px] h-9">
                            <Truck className="mr-2 h-4 w-4 text-muted-foreground ml-2" />
                            <SelectValue placeholder="شركة التوصيل" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">الكل</SelectItem>
                            <SelectItem value="none">غير مسند</SelectItem>
                            {deliveryCompanies?.map((company) => (
                                <SelectItem key={company.id} value={company.id}>{company.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Date Filters */}
                    <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-md">
                        <Calendar size={14} className="text-muted-foreground mx-1" />
                        <Input
                            type="date"
                            className="w-32 h-7 text-xs bg-background border-none shadow-none focus-visible:ring-0"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                        />
                        <span className="text-xs text-muted-foreground">-</span>
                        <Input
                            type="date"
                            className="w-32 h-7 text-xs bg-background border-none shadow-none focus-visible:ring-0"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                        />
                    </div>

                    {(fromDate || toDate || statusFilter !== "all" || deliveryFilter !== "all" || searchTerm) && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 text-xs text-muted-foreground hover:text-foreground"
                            onClick={() => {
                                setFromDate("");
                                setToDate("");
                                setStatusFilter("all");
                                setDeliveryFilter("all");
                                setSearchTerm("");
                            }}
                        >
                            إعادة تعيين
                        </Button>
                    )}
                </div>

                <div className="flex gap-2 shrink-0">
                    <Button variant="outline" className="gap-2 h-9 border-primary text-primary hover:bg-primary/5" onClick={() => setManualOrderOpen(true)}>
                        <Plus size={16} />
                        طلب يدوي
                    </Button>
                    <Button className="gap-2 h-9" onClick={exportToCSV}>
                        <Download size={16} />
                        تصدير الشيت
                    </Button>
                </div>
            </div>

            <ManualOrderModal open={manualOrderOpen} onOpenChange={setManualOrderOpen} />

            {/* Orders Table */}
            <div className="bg-card rounded-lg border border-border overflow-hidden shadow-sm overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50">
                            <TableHead className="text-right">رقم الطلب</TableHead>
                            <TableHead className="text-right">التاريخ</TableHead>
                            <TableHead className="text-right">العميل</TableHead>
                            <TableHead className="text-right">الإجمالي</TableHead>
                            <TableHead className="text-right">الحالة</TableHead>
                            <TableHead className="text-right">شركة التوصيل</TableHead>
                            <TableHead className="text-center">إجراءات</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">جاري تحميل الطلبات...</TableCell>
                            </TableRow>
                        ) : filteredOrders?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                                    <div className="flex flex-col items-center gap-2">
                                        <Truck className="h-8 w-8 text-muted-foreground/50" />
                                        <p>لا توجد طلبات مطابقة للبحث</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : filteredOrders?.map((order) => (
                            <TableRow key={order.id} className="hover:bg-muted/30 transition-colors">
                                <TableCell className="font-medium font-mono text-xs">{order.order_number}</TableCell>
                                <TableCell className="text-xs text-muted-foreground">
                                    {order.created_at && format(new Date(order.created_at), 'yyyy/MM/dd', { locale: ar })}
                                    <div className="text-[10px]">{order.created_at && format(new Date(order.created_at), 'hh:mm a')}</div>
                                </TableCell>
                                <TableCell>
                                    <div className="font-medium text-sm">{order.customer_name}</div>
                                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                                        {order.governorates?.name}
                                    </div>
                                </TableCell>
                                <TableCell className="font-bold text-sm tracking-tight">{formatPrice(order.total)}</TableCell>
                                <TableCell>
                                    <Badge className={`${statusMap[order.status || 'new'].color} hover:${statusMap[order.status || 'new'].color} shadow-none font-normal`}>
                                        {statusMap[order.status || 'new'].label}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Select
                                        value={order.delivery_company_id || "none"}
                                        onValueChange={(val) => assignDelivery.mutate({
                                            orderId: order.id,
                                            companyId: val === "none" ? null : val
                                        })}
                                    >
                                        <SelectTrigger className="h-7 text-xs w-[130px] bg-background">
                                            <SelectValue placeholder="تعيين شركة" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">-- بدون --</SelectItem>
                                            {deliveryCompanies?.map((comp) => (
                                                <SelectItem key={comp.id} value={comp.id}>{comp.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </TableCell>
                                <TableCell className="text-center">
                                    <Link to={`/admin/orders/${order.id}`}>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <Eye size={16} />
                                        </Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
