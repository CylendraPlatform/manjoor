import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, Plus, Trash2, UserPlus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import type { Tables } from "@/integrations/supabase/types";
import { getErrorMessage } from "@/lib/utils";

interface AgentAssignedOrder {
    id: string;
    status: string;
    total: number | null;
}
type AgentRow = Tables<"profiles"> & { assigned_orders: AgentAssignedOrder[] };
interface FunctionErrorContext {
    context?: { json: () => Promise<{ error?: string; message?: string }> };
}

const agentSchema = z.object({
    email: z.string().email("بريد إلكتروني غير صالح"),
    password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
    full_name: z.string().min(2, "الاسم الكامل مطلوب"),
    phone: z.string().min(10, "رقم الهاتف مطلوب"),
});

export default function AdminAgents() {
    const [searchTerm, setSearchTerm] = useState("");
    const [open, setOpen] = useState(false);
    const queryClient = useQueryClient();

    const form = useForm<z.infer<typeof agentSchema>>({
        resolver: zodResolver(agentSchema),
        defaultValues: {
            email: "",
            password: "",
            full_name: "",
            phone: "",
        },
    });

    const { data: agents, isLoading } = useQuery({
        queryKey: ["admin-agents"],
        queryFn: async () => {
            // Fetch agents and their associated orders to calculate stats
            const { data, error } = await supabase
                .from("profiles")
                .select(`
                    *,
                    assigned_orders:orders!agent_id(id, status, total)
                `)
                .eq("role", "agent")
                .order("created_at", { ascending: false });

            if (error) throw error;

            // Transform data to include counts
            return (data as unknown as AgentRow[]).map(agent => {
                const orders = agent.assigned_orders || [];
                const deliveredOrders = orders.filter((o) => o.status === 'delivered');
                return {
                    ...agent,
                    total_orders: orders.length,
                    delivered_orders: deliveredOrders.length,
                    total_collected: deliveredOrders.reduce((sum, o) => sum + (o.total || 0), 0)
                };
            });
        },
    });

    const createAgent = useMutation({
        mutationFn: async (values: z.infer<typeof agentSchema>) => {
            console.log("Calling create-agent-user with:", values);
            const { data, error } = await supabase.functions.invoke("create-agent-user", {
                body: values,
            });

            if (error) {
                console.error("Function error object:", error);
                let message = error.message;

                // For FunctionsHttpError, the context is the Response object
                const ctxError = error as FunctionErrorContext;
                if (ctxError.context) {
                    try {
                        const errorBody = await ctxError.context.json();
                        console.error("Function error body:", errorBody);
                        message = errorBody.error || errorBody.message || message;
                    } catch (e) {
                        console.error("Could not parse error body as JSON");
                    }
                }
                throw new Error(message);
            }

            if (data && data.error) throw new Error(data.error);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-agents"] });
            toast.success("تم إضافة الوكيل بنجاح");
            setOpen(false);
            form.reset();
        },
        onError: (error: unknown) => {
            console.error("Full mutation error:", error);
            toast.error(`فشل إضافة الوكيل: ${getErrorMessage(error)}`);
        },
    });

    const deleteAgent = useMutation({
        mutationFn: async (id: string) => {
            // NOTE: Deleting a user requires Admin API which is not directly accessible from client.
            // We might need another Edge Function for deleting users, or just disable them.
            // For now, let's just delete the profile or set role to 'customer'.
            // Deleting profile might not delete auth user.
            const { error } = await supabase
                .from("profiles")
                .update({ role: "customer" }) // Revoke agent access
                .eq("id", id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-agents"] });
            toast.success("تم إزالة صلاحية الوكيل");
        },
        onError: () => toast.error("حدث خطأ أثناء الحذف"),
    });

    const onSubmit = (values: z.infer<typeof agentSchema>) => {
        createAgent.mutate(values);
    };

    const filteredAgents = agents?.filter((agent) =>
        agent.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 max-w-sm w-full">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input
                        placeholder="بحث عن وكيل (مندوب)..."
                        className="pr-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2 w-full md:w-auto">
                            <UserPlus size={18} />
                            إضافة وكيل (مندوب) جديد
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>إضافة وكيل (مندوب) جديد</DialogTitle>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="full_name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>الاسم الكامل</FormLabel>
                                            <FormControl>
                                                <Input placeholder="الاسم الكامل" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>البريد الإلكتروني</FormLabel>
                                            <FormControl>
                                                <Input placeholder="example@domain.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>رقم الهاتف</FormLabel>
                                            <FormControl>
                                                <Input placeholder="07XXXXXXXX" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>كلمة المرور</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder="******" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full" disabled={createAgent.isPending}>
                                    {createAgent.isPending && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                                    إضافة
                                </Button>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="bg-card rounded-lg border border-border overflow-hidden overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-right">الاسم</TableHead>
                            <TableHead className="text-right">البريد الإلكتروني</TableHead>
                            <TableHead className="text-right">رقم الهاتف</TableHead>
                            <TableHead className="text-center">إجمالي الطلبات</TableHead>
                            <TableHead className="text-center">تم التوصيل</TableHead>
                            <TableHead className="text-center">إجمالي التحصيل</TableHead>
                            <TableHead className="text-right">تاريخ الانضمام</TableHead>
                            <TableHead className="text-center">إجراءات</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">جابري التحميل...</TableCell>
                            </TableRow>
                        ) : filteredAgents?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">لا يوجد وكلاء (مناديب) حالياً</TableCell>
                            </TableRow>
                        ) : filteredAgents?.map((agent) => (
                            <TableRow key={agent.id}>
                                <TableCell className="font-medium">{agent.full_name || "غير محدد"}</TableCell>
                                <TableCell>{agent.email}</TableCell>
                                <TableCell dir="ltr" className="text-right">{agent.phone || "-"}</TableCell>
                                <TableCell className="text-center">
                                    <Badge variant="secondary" className="font-bold">
                                        {agent.total_orders}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-center">
                                    <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 font-bold">
                                        {agent.delivered_orders}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-center font-bold text-blue-600">
                                    {formatPrice(agent.total_collected)}
                                </TableCell>
                                <TableCell>{new Date(agent.created_at).toLocaleDateString('ar-EG')}</TableCell>
                                <TableCell className="text-center">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-destructive hover:text-destructive"
                                        onClick={() => {
                                            if (confirm("هل أنت متأكد من إزالة صلاحية هذا الوكيل؟")) {
                                                deleteAgent.mutate(agent.id);
                                            }
                                        }}
                                    >
                                        <Trash2 size={18} />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
