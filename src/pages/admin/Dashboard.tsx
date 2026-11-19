import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    ShoppingBag,
    TrendingUp,
    TrendingDown,
    Users,
    MapPin,
    DollarSign,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    Package,
    AlertCircle
} from "lucide-react";
import { formatPrice } from "@/lib/format";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    PieChart,
    Pie,
    LineChart,
    Line,
} from 'recharts';
import { useEffect } from "react";
import {
    format,
    startOfMonth,
    endOfMonth,
    isWithinInterval,
    startOfDay,
    endOfDay,
    subDays,
    isToday,
    parseISO
} from 'date-fns';
import { ar } from 'date-fns/locale';

export default function AdminDashboard() {
    const { data: stats, isLoading } = useQuery({
        queryKey: ["admin-analytics-v2"],
        queryFn: async () => {
            // Fetch all necessary data
            const { data: orders } = await supabase
                .from("orders")
                .select("*, governorates(name)");

            const { data: orderItems } = await supabase
                .from("order_items")
                .select("*, products(purchase_price)");

            const { data: products } = await supabase.from("products").select("id, name, stock, sold_count");

            if (!orders) return null;

            const now = new Date();
            const todayStart = startOfDay(now);
            const todayEnd = endOfDay(now);
            const monthStart = startOfMonth(now);
            const monthEnd = endOfMonth(now);

            // 1. Basic Metrics
            const totalRevenue = orders.reduce((acc, curr) => acc + Number(curr.total), 0);
            const totalOrders = orders.length;
            const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

            const todayOrders = orders.filter(o => {
                const d = parseISO(o.created_at);
                return isWithinInterval(d, { start: todayStart, end: todayEnd });
            });
            const todayRevenue = todayOrders.reduce((acc, curr) => acc + Number(curr.total), 0);

            const monthOrders = orders.filter(o => {
                const d = parseISO(o.created_at);
                return isWithinInterval(d, { start: monthStart, end: monthEnd });
            });
            const monthRevenue = monthOrders.reduce((acc, curr) => acc + Number(curr.total), 0);

            // ... inside queryFn ...
            // 2. Cancellation Rate
            const cancelledOrders = orders.filter(o => o.status === 'cancelled').length;
            const cancellationRate = totalOrders > 0 ? (cancelledOrders / totalOrders) * 100 : 0;



            // 3. Profit Calculation (Revenue - Purchase Price)
            let totalProfit = 0;
            orderItems?.forEach(item => {
                const pPrice = Number((item.products as any)?.purchase_price || 0);
                const sPrice = Number(item.price);
                totalProfit += (sPrice - pPrice) * item.quantity;
            });

            // 4. Best Selling Products (by quantity)
            const productSales: Record<string, { name: string, quantity: number, revenue: number }> = {};
            orderItems?.forEach(item => {
                if (!productSales[item.product_name]) {
                    productSales[item.product_name] = { name: item.product_name, quantity: 0, revenue: 0 };
                }
                productSales[item.product_name].quantity += item.quantity;
                productSales[item.product_name].revenue += item.quantity * Number(item.price);
            });
            const topProducts = Object.values(productSales)
                .sort((a, b) => b.quantity - a.quantity)
                .slice(0, 5);

            // 5. Top Governorates (by revenue)
            const govSales: Record<string, { name: string, revenue: number, count: number }> = {};
            orders.forEach(o => {
                const name = (o.governorates as any)?.name || 'غير معروف';
                if (!govSales[name]) govSales[name] = { name, revenue: 0, count: 0 };
                govSales[name].revenue += Number(o.total);
                govSales[name].count += 1;
            });
            const govData = Object.values(govSales)
                .sort((a, b) => b.revenue - a.revenue)
                .slice(0, 6);

            // 6. Sales Trend (Last 7 days)
            const last7Days = [...Array(7)].map((_, i) => {
                const d = subDays(now, i);
                return {
                    date: format(d, 'EEEE', { locale: ar }),
                    timestamp: d,
                    revenue: 0,
                    orders: 0
                };
            }).reverse();

            orders.forEach(o => {
                const d = parseISO(o.created_at);
                const dayMatch = last7Days.find(day =>
                    day.timestamp.getDate() === d.getDate() &&
                    day.timestamp.getMonth() === d.getMonth()
                );
                if (dayMatch) {
                    dayMatch.revenue += Number(o.total);
                    dayMatch.orders += 1;
                }
            });

            // 7. Order Status Distribution
            const statusCounts: Record<string, number> = {};
            orders.forEach(o => {
                statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
            });
            const statusNames: Record<string, string> = {
                'new': 'جديد',
                'confirmed': 'مؤكد',
                'shipping': 'قيد الشحن',
                'delivered': 'تم التوصيل',
                'cancelled': 'ملغي',
                'returned': 'مسترجع'
            };
            const statusData = Object.entries(statusCounts).map(([status, count]) => ({
                name: statusNames[status] || status,
                value: count
            }));

            // 8. Monthly Profit Trend (Current Year)
            const monthNames = ["كانون الثاني", "شباط", "آذار", "نيسان", "أيار", "حزيران", "تموز", "آب", "أيلول", "تشرين الأول", "تشرين الثاني", "كانون الأول"];
            const monthlyStats: Record<number, { name: string, revenue: number, profit: number }> = {};

            // Initialize months
            for (let i = 0; i < 12; i++) {
                monthlyStats[i] = { name: monthNames[i], revenue: 0, profit: 0 };
            }

            orders.forEach(o => {
                const d = parseISO(o.created_at);
                if (d.getFullYear() === now.getFullYear()) {
                    const m = d.getMonth();
                    monthlyStats[m].revenue += Number(o.total);
                }
            });

            // Add profit to monthly stats
            orderItems?.forEach(item => {
                const d = parseISO((item as any).created_at || (orders.find(o => o.id === item.order_id)?.created_at));
                if (d && d.getFullYear() === now.getFullYear()) {
                    const m = d.getMonth();
                    const pPrice = Number((item.products as any)?.purchase_price || 0);
                    const sPrice = Number(item.price);
                    monthlyStats[m].profit += (sPrice - pPrice) * item.quantity;
                }
            });

            const monthlyData = Object.values(monthlyStats);

            return {
                metrics: {
                    totalRevenue,
                    todayRevenue,
                    monthRevenue,
                    totalOrders,
                    todayOrdersCount: todayOrders.length,
                    avgOrderValue,
                    cancellationRate,
                    totalProfit
                },
                topProducts,
                govData,
                salesTrend: last7Days,
                statusData,
                monthlyData
            };
        }
    });

    useEffect(() => {
        if (stats?.metrics?.cancellationRate && stats.metrics.cancellationRate > 20 && stats.metrics.totalOrders > 5) {
            const todayStr = new Date().toISOString().split('T')[0];
            const notifKey = `cancellation-alert-${todayStr}`;
            if (!localStorage.getItem(notifKey)) {
                (async () => {
                    await supabase.from("admin_notifications").insert({
                        type: 'cancellation',
                        title: 'تنبيه: ارتفاع نسبة الإلغاء',
                        message: `نسبة إلغاء الطلبات وصلت إلى ${stats.metrics.cancellationRate.toFixed(1)}% اليوم (${stats.metrics.cancellationRate.toFixed(0)}%).`,
                        link: '/admin/orders?status=cancelled'
                    });
                    localStorage.setItem(notifKey, 'true');
                })();
            }
        }
    }, [stats]);

    if (isLoading) return <div className="flex items-center justify-center min-h-[400px]">جاري تحميل البيانات الإحصائية...</div>;

    const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1'];

    const mainCards = [
        {
            title: "مبيعات اليوم",
            value: formatPrice(stats?.metrics.todayRevenue || 0),
            sub: `${stats?.metrics.todayOrdersCount} طلبات`,
            icon: Calendar,
            color: "text-blue-600",
            bg: "bg-blue-50"
        },
        {
            title: "إجمالي المبيعات",
            value: formatPrice(stats?.metrics.totalRevenue || 0),
            sub: `منذ البداية`,
            icon: TrendingUp,
            color: "text-green-600",
            bg: "bg-green-50"
        },
        {
            title: "متوسط قيمة الطلب",
            value: formatPrice(stats?.metrics.avgOrderValue || 0),
            sub: `لكل عملية شراء`,
            icon: DollarSign,
            color: "text-purple-600",
            bg: "bg-purple-50"
        },
        {
            title: "صافي الربح التقديري",
            value: formatPrice(stats?.metrics.totalProfit || 0),
            sub: `بعد خصم التكلفة`,
            icon: ArrowUpRight,
            color: "text-emerald-600",
            bg: "bg-emerald-50"
        },
    ];

    return (
        <div className="space-y-6 pb-10">
            {/* Metric Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {mainCards.map((card) => (
                    <Card key={card.title} className="overflow-hidden border-none shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-bold text-muted-foreground">{card.title}</CardTitle>
                            <div className={`p-2 rounded-lg ${card.bg}`}>
                                <card.icon className={`h-4 w-4 ${card.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-black">{card.value}</div>
                            <p className="text-xs text-muted-foreground mt-1 font-medium">{card.sub}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Secondary Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="flex items-center p-6 gap-4 border-none shadow-sm">
                    <div className="p-3 bg-red-50 rounded-full">
                        <AlertCircle className="text-red-500" size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground font-bold">نسبة الإلغاء</p>
                        <div className="text-xl font-black text-red-600">{stats?.metrics.cancellationRate.toFixed(1)}%</div>
                    </div>
                </Card>
                <Card className="flex items-center p-6 gap-4 border-none shadow-sm">
                    <div className="p-3 bg-indigo-50 rounded-full">
                        <ShoppingBag className="text-indigo-500" size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground font-bold">إجمالي الطلبات</p>
                        <div className="text-xl font-black">{stats?.metrics.totalOrders}</div>
                    </div>
                </Card>
                <Card className="flex items-center p-6 gap-4 border-none shadow-sm">
                    <div className="p-3 bg-emerald-50 rounded-full">
                        <TrendingUp className="text-emerald-500" size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground font-bold">نمو المبيعات</p>
                        <div className="text-xl font-black">+{((stats?.metrics.monthRevenue || 0) / (stats?.metrics.totalRevenue || 1) * 100).toFixed(1)}%</div>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Sales Trend */}
                <Card className="lg:col-span-2 border-none shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <TrendingUp size={20} className="text-primary" />
                            حركة المبيعات (آخر 7 أيام)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[350px] pt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={stats?.salesTrend}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 11, fontWeight: 600 }}
                                    padding={{ left: 20, right: 20 }}
                                />
                                <YAxis hide />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value: any) => [formatPrice(value), "المبيعات"]}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#ec4899"
                                    strokeWidth={4}
                                    dot={{ r: 6, fill: "#ec4899", strokeWidth: 2, stroke: "#fff" }}
                                    activeDot={{ r: 8 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Status Distribution */}
                <Card className="border-none shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg">توزيع حالات الطلبات</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[350px] flex flex-col items-center justify-center">
                        <ResponsiveContainer width="100%" height="80%">
                            <PieChart>
                                <Pie
                                    data={stats?.statusData}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {stats?.statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', direction: 'rtl' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 w-full mt-4">
                            {stats?.statusData.map((item, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                    <span className="text-[10px] font-bold">{item.name}: {item.value}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Monthly Profit & Revenue Chart */}
                <Card className="lg:col-span-3 border-none shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <TrendingUp size={20} className="text-primary" />
                            الأداء الشهري (الأرباح والمبيعات)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[350px] pt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats?.monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 11, fontWeight: 600 }}
                                />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', direction: 'rtl' }}
                                    formatter={(value: any) => [formatPrice(value)]}
                                />
                                <Bar dataKey="revenue" name="المبيعات" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="profit" name="الأرباح" fill="#10b981" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Best Selling Products */}
                <Card className="border-none shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Package size={20} className="text-primary" />
                            المنتجات الأكثر طلباً
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-5">
                            {stats?.topProducts.map((p, i) => (
                                <div key={i} className="flex items-center justify-between group">
                                    <div className="space-y-1">
                                        <p className="text-sm font-bold group-hover:text-primary transition-colors">{p.name}</p>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="secondary" className="text-[10px] py-0">{p.quantity} قطعة</Badge>
                                            <span className="text-[10px] text-muted-foreground font-medium">{formatPrice(p.revenue)}</span>
                                        </div>
                                    </div>
                                    <div className="h-2 w-16 bg-muted rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary"
                                            style={{ width: `${(p.revenue / (stats?.metrics.totalRevenue || 1)) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                            {stats?.topProducts.length === 0 && <p className="text-center py-4 text-muted-foreground text-sm italic">لا توجد مبيعات حالياً</p>}
                        </div>
                    </CardContent>
                </Card>

                {/* Top Governorates */}
                <Card className="lg:col-span-2 border-none shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <MapPin size={20} className="text-primary" />
                            أداء المحافظات
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[250px] pt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats?.govData} layout="vertical" margin={{ right: 30 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    width={100}
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fontWeight: 700 }}
                                />
                                <Tooltip
                                    cursor={{ fill: '#f8f9fa' }}
                                    formatter={(v: any) => [formatPrice(v), "إجمالي المبيعات"]}
                                    contentStyle={{ borderRadius: '12px', border: 'none' }}
                                />
                                <Bar dataKey="revenue" radius={[0, 10, 10, 0]} barSize={20}>
                                    {stats?.govData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
