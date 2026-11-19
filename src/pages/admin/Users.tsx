import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, User, Mail, Phone, Coins, ShieldCheck, ShieldAlert, UserPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

type ProfileRole = "admin" | "agent" | "customer";

function isCustomerLike(role: string | null | undefined) {
    return role === "customer" || role === "user";
}

function displayName(user: { full_name?: string | null; email?: string | null }) {
    return user.full_name?.trim() || user.email || "هذا المستخدم";
}

export default function AdminUsers() {
    const [searchTerm, setSearchTerm] = useState("");
    const queryClient = useQueryClient();

    const { data: users, isLoading } = useQuery({
        queryKey: ["admin-users"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("profiles")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            return data;
        }
    });

    const updateRole = useMutation({
        mutationFn: async ({ userId, role }: { userId: string; role: ProfileRole }) => {
            const { error } = await supabase.from("profiles").update({ role }).eq("id", userId);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-users"] });
            toast.success("تم تحديث صلاحيات المستخدم");
        },
        onError: () => toast.error("حدث خطأ أثناء التحديث"),
    });

    const filteredUsers = users?.filter(user =>
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.includes(searchTerm) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <h1 className="text-2xl font-bold">إدارة المستخدمين</h1>
                <div className="relative flex-1 max-w-sm w-full">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input
                        placeholder="بحث بالاسم، الهاتف، أو الإيميل..."
                        className="pr-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-card rounded-lg border border-border overflow-hidden overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-right">المستخدم</TableHead>
                            <TableHead className="text-right">معلومات التواصل</TableHead>
                            <TableHead className="text-right">نقاط الولاء</TableHead>
                            <TableHead className="text-right">تاريخ التسجيل</TableHead>
                            <TableHead className="text-right">الصلاحية</TableHead>
                            <TableHead className="text-center">إجراءات</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">جاري التحميل...</TableCell>
                            </TableRow>
                        ) : filteredUsers?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">لا يوجد مستخدمين مطابقين</TableCell>
                            </TableRow>
                        ) : filteredUsers?.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                            {user.full_name?.charAt(0) || <User size={20} />}
                                        </div>
                                        <div className="font-medium">{user.full_name || "بدون اسم"}</div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="space-y-1 text-xs">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Phone size={12} />
                                            <span dir="ltr">{user.phone || "لا يوجد رقم"}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Mail size={12} />
                                            <span>{user.email || "بدون بريد الكتروني"}</span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Coins size={16} className="text-amber-500" />
                                        <span className="font-bold">{(user as any).points || 0}</span>
                                        <span className="text-[10px] text-muted-foreground">({formatPrice(((user as any).points || 0) * 10)})</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-xs">
                                    {user.created_at ? format(new Date(user.created_at), 'yyyy/MM/dd', { locale: ar }) : "-"}
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        className={
                                            user.role === "admin"
                                                ? "bg-red-500"
                                                : user.role === "agent"
                                                  ? "bg-purple-500"
                                                  : "bg-blue-500"
                                        }
                                    >
                                        {user.role === "admin"
                                            ? "مدير"
                                            : user.role === "agent"
                                              ? "وكيل (مندوب)"
                                              : "زبون"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-center">
                                    <div className="flex flex-wrap items-center justify-center gap-2">
                                        {isCustomerLike(user.role) && (
                                            <>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-primary hover:text-primary hover:bg-primary/5 gap-2"
                                                    disabled={updateRole.isPending}
                                                    onClick={() => {
                                                        const name = displayName(user);
                                                        if (confirm(`هل أنت متأكد من ترقية ${name} إلى وكيل (مندوب)؟`)) {
                                                            updateRole.mutate({ userId: user.id, role: "agent" });
                                                        }
                                                    }}
                                                >
                                                    <UserPlus size={16} />
                                                    ترقية لوكيل
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 gap-2"
                                                    disabled={updateRole.isPending}
                                                    onClick={() => {
                                                        const name = displayName(user);
                                                        if (confirm(`هل أنت متأكد من منح ${name} صلاحيات مدير؟`)) {
                                                            updateRole.mutate({ userId: user.id, role: "admin" });
                                                        }
                                                    }}
                                                >
                                                    <ShieldCheck size={16} />
                                                    ترقية لمدير
                                                </Button>
                                            </>
                                        )}
                                        {user.role === "agent" && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 gap-2"
                                                disabled={updateRole.isPending}
                                                onClick={() => {
                                                    const name = displayName(user);
                                                    if (
                                                        confirm(
                                                            `هل أنت متأكد من سحب صلاحية الوكيل من ${name} وتنزيله إلى زبون عادي؟`,
                                                        )
                                                    ) {
                                                        updateRole.mutate({ userId: user.id, role: "customer" });
                                                    }
                                                }}
                                            >
                                                <ShieldAlert size={16} />
                                                تنزيل لزبون
                                            </Button>
                                        )}
                                        {user.role === "admin" && (
                                            <Badge variant="outline" className="text-red-600">
                                                مدير النظام
                                            </Badge>
                                        )}
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
