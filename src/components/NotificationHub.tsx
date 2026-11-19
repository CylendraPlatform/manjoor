import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { playNotificationSound } from "@/lib/notifications";
import { useQueryClient } from "@tanstack/react-query";

export function NotificationHub() {
    const { user, profile, isAdmin } = useAuth();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!user) return;

        const channels: any[] = [];

        // 1. Admin Notifications Listener
        if (isAdmin) {
            const adminChannel = supabase
                .channel('admin-global-notifications')
                .on(
                    'postgres_changes',
                    { event: 'INSERT', schema: 'public', table: 'admin_notifications' },
                    (payload) => {
                        console.log("New Admin Notification:", payload.new);
                        queryClient.invalidateQueries({ queryKey: ["admin-notifications"] });

                        toast.info(payload.new.title, {
                            description: payload.new.message,
                            duration: 10000,
                            action: {
                                label: "عرض",
                                onClick: () => window.location.href = payload.new.link || '/admin'
                            }
                        });

                        playNotificationSound();
                    }
                )
                .subscribe();
            channels.push(adminChannel);
        }

        // 2. User/Agent Notifications Listener
        const userChannel = supabase
            .channel(`user-notifications-${user.id}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'user_notifications',
                    filter: `user_id=eq.${user.id}`
                },
                (payload) => {
                    console.log("New User Notification:", payload.new);
                    queryClient.invalidateQueries({ queryKey: ["user-notifications", user.id] });

                    toast.success(payload.new.title, {
                        description: payload.new.message,
                        duration: 10000,
                        action: {
                            label: "عرض",
                            onClick: () => window.location.href = payload.new.link || '/profile'
                        }
                    });

                    playNotificationSound();
                }
            )
            .subscribe();
        channels.push(userChannel);

        return () => {
            channels.forEach(ch => supabase.removeChannel(ch));
        };
    }, [user, isAdmin, queryClient]);

    return null; // This component doesn't render anything UI-wise
}
