import { Home, LayoutGrid, Tag, ShoppingBag, User, Truck, LayoutDashboard } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useCartStore } from "@/lib/cart-store";
import { useAuth } from "@/hooks/use-auth";

const BottomNav = () => {
    const location = useLocation();
    const { getItemCount } = useCartStore();
    const { profile, isAdmin } = useAuth();
    const itemCount = getItemCount();
    const isAgent = profile?.role === "agent";

    const navItems = [
        { icon: Home, label: "الرئيسية", path: "/" },
        { icon: LayoutGrid, label: "الأقسام", path: "/products" },
        { icon: Tag, label: "العروض", path: "/offers" },
        { icon: ShoppingBag, label: "السلة", path: "/cart", badge: itemCount },
        ...(isAdmin ? [{ icon: LayoutDashboard, label: "الإدارة", path: "/admin" }] : []),
        ...(isAgent && !isAdmin ? [{ icon: Truck, label: "التوصيل", path: "/agent/orders" }] : []),
        { icon: User, label: "حسابي", path: "/profile" },
    ];

    const gridCols = navItems.length;

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[60] bg-background/95 backdrop-blur-lg border-t border-border shadow-[0_-4px_12px_rgba(0,0,0,0.05)] h-16 safe-area-inset-bottom">
            <div className={`grid h-full items-center`} style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}>
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 ${isActive ? "text-primary scale-110" : "text-muted-foreground hover:text-primary"
                                }`}
                        >
                            <div className="relative">
                                <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                                {item.badge !== undefined && item.badge > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-destructive text-white text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full border-2 border-background animate-in zoom-in">
                                        {item.badge}
                                    </span>
                                )}
                            </div>
                            <span className="text-[10px] font-bold">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
};

export default BottomNav;
