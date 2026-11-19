import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Bell, ShoppingBag, AlertTriangle, AlertCircle, Info } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useEffect } from "react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

export function Notifications() {
    const queryClient = useQueryClient();

    const { data: notifications, isLoading } = useQuery({
        queryKey: ["admin-notifications"],
        queryFn: async () => {
            const { data } = await supabase
                .from("admin_notifications")
                .select("*")
                .order("created_at", { ascending: false })
                .limit(20);
            return data || [];
        }
    });

    const unreadCount = notifications?.filter(n => !n.is_read).length || 0;

    const markAsRead = useMutation({
        mutationFn: async (id: string) => {
            await supabase
                .from("admin_notifications")
                .update({ is_read: true })
                .eq("id", id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-notifications"] });
        }
    });

    const markAllRead = useMutation({
        mutationFn: async () => {
            const unreadIds = notifications?.filter(n => !n.is_read).map(n => n.id) || [];
            if (unreadIds.length === 0) return;
            await supabase
                .from("admin_notifications")
                .update({ is_read: true })
                .in("id", unreadIds);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-notifications"] });
            toast.success("تم تحديد الكل كمقروء");
        }
    });

    // Realtime subscription is now handled by NotificationHub globally
    // for all users (admin, agent, customers)

    const getIcon = (type: string) => {
        switch (type) {
            case 'order': return <ShoppingBag className="h-4 w-4 text-primary" />;
            case 'stock': return <AlertTriangle className="h-4 w-4 text-amber-500" />;
            case 'cancellation': return <AlertCircle className="h-4 w-4 text-red-500" />;
            default: return <Info className="h-4 w-4 text-blue-500" />;
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-red-600 animate-pulse ring-2 ring-background" />
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex items-center justify-between">
                    <span>الإشعارات</span>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs h-6 px-2"
                            onClick={() => markAllRead.mutate()}
                        >
                            تحديد الكل كمقروء
                        </Button>
                    )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <ScrollArea className="h-[300px]">
                    {isLoading ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">جاري التحميل...</div>
                    ) : notifications?.length === 0 ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">لا توجد إشعارات جديدة</div>
                    ) : (
                        notifications?.map((notification) => (
                            <DropdownMenuItem
                                key={notification.id}
                                className={`flex flex-col items-start gap-1 p-3 cursor-pointer ${!notification.is_read ? 'bg-muted/50' : ''}`}
                                onClick={() => {
                                    if (!notification.is_read) markAsRead.mutate(notification.id);
                                    if (notification.link) window.location.href = notification.link;
                                }}
                            >
                                <div className="flex w-full items-start justify-between gap-2">
                                    <div className="flex items-center gap-2 font-medium text-sm">
                                        {getIcon(notification.type)}
                                        {notification.title}
                                    </div>
                                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                                        {format(new Date(notification.created_at), 'HH:mm', { locale: ar })}
                                    </span>
                                </div>
                                <div className="text-xs text-muted-foreground line-clamp-2 w-full pr-6">
                                    {notification.message}
                                </div>
                            </DropdownMenuItem>
                        ))
                    )}
                </ScrollArea>
                <DropdownMenuSeparator />
                <div className="p-2">
                    <Button variant="outline" size="sm" className="w-full text-xs" asChild>
                        <Link to="/admin/notifications">عرض كل الإشعارات</Link>
                    </Button>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
