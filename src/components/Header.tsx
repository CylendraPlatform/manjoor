import { ShoppingBag, Menu, X, User, Search, Package, Heart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "@/lib/cart-store";
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { formatPrice } from "@/lib/format";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";

const Header = () => {
  const { items, getItemCount, getTotal, removeItem, updateQuantity } = useCartStore();
  const { user, isAdmin } = useAuth();
  const itemCount = getItemCount();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Smart Mobile Header Logic
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - lastScrollY;

      if (window.innerWidth < 768) {
        // Thresholds to prevent flickering
        if (currentScrollY > 120) {
          if (scrollDelta > 15) { // Needs significant scroll down
            setIsCollapsed(true);
          } else if (scrollDelta < -20) { // Needs significant scroll up
            setIsCollapsed(false);
          }
        } else if (currentScrollY < 50) {
          setIsCollapsed(false);
        }
      } else {
        setIsCollapsed(false);
      }

      // Only update lastScrollY if we've moved enough to avoid tiny jitters
      if (Math.abs(scrollDelta) > 5) {
        setLastScrollY(currentScrollY);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const { data: categories } = useQuery({
    queryKey: ["header-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  const categoryTree = categories?.filter((cat: any) => !cat.parent_id).map((parent: any) => ({
    ...parent,
    children: categories.filter((child: any) => child.parent_id === parent.id)
  })) || [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className={`sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border transition-all duration-300 safe-top ${isCollapsed ? 'shadow-sm' : ''}`}>
      {/* Top Bar - Stable transition */}
      <div className={`bg-primary/5 border-b border-primary/10 hidden sm:block overflow-hidden transition-all duration-300 ${isCollapsed ? 'h-0 opacity-0' : 'h-8 opacity-100'}`}>
        <div className="container flex justify-between items-center h-full text-[10px] md:text-xs">
          <div className="flex items-center gap-4 text-muted-foreground">
            <Link to="/track-order" className="hover:text-primary flex items-center gap-1 transition-colors">
              <Package size={12} />
              تتبع طلبك
            </Link>
          </div>
          <div className="text-muted-foreground font-medium">
            توصيل لجميع محافظات العراق 🇮🇶
          </div>
        </div>
      </div>

      <div className={`container flex items-center justify-between gap-4 transition-all duration-300 ${isCollapsed ? 'h-14' : 'h-16 md:h-20'}`}>
        {/* Mobile menu trigger */}
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden flex-shrink-0 p-1">
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Logo - Hidden on mobile when collapsed */}
        <Link to="/" className={`flex items-center flex-shrink-0 transition-all duration-300 ${isCollapsed ? 'md:flex hidden scale-0 w-0' : 'scale-100'}`}>
          <img src="/dukany-logo.png" alt="متجر دكاني" className="h-10 md:h-14 w-auto object-contain py-1" />
        </Link>

        {/* Search Bar - Visible in main row on mobile when collapsed */}
        {isCollapsed && (
          <div className="flex-1 md:hidden animate-in fade-in slide-in-from-top-2 duration-300">
            <form onSubmit={handleSearch} className="relative group">
              <Input
                placeholder="ابحث هنا..."
                className="pr-9 bg-accent/50 border-transparent focus:bg-background focus:border-primary/50 transition-all rounded-full h-9 text-xs font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Search size={16} />
              </button>
            </form>
          </div>
        )}

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-bold flex-shrink-0">
          <Link to="/" className="hover:text-primary transition-colors">الرئيسية</Link>
          <DropdownMenu dir="rtl">
            <DropdownMenuTrigger className="flex items-center gap-1 hover:text-primary transition-colors outline-none cursor-pointer">
              <span>الأقسام</span>
              <ChevronDown size={14} className="text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64 max-h-[80vh] overflow-y-auto">
              {categoryTree.map((cat: any) => (
                <div key={cat.id}>
                  {cat.children && cat.children.length > 0 ? (
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger className="cursor-pointer py-2.5 px-3">
                        <span className="flex-1 text-right">{cat.name}</span>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent className="w-56" sideOffset={8}>
                          {cat.children.map((child: any) => (
                            <DropdownMenuItem key={child.id} asChild className="cursor-pointer">
                              <Link to={`/category/${child.slug}`} className="w-full text-right py-1">
                                {child.name}
                              </Link>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                  ) : (
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link to={`/category/${cat.slug}`} className="w-full text-right py-2.5 px-3">
                        {cat.name}
                      </Link>
                    </DropdownMenuItem>
                  )}
                </div>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Link to="/products" className="hover:text-primary transition-colors">المنتجات</Link>
          <Link to="/offers" className="hover:text-primary transition-colors flex items-center gap-1">
            <span className="text-destructive font-black">العروض</span>
            <span className="animate-bounce">🔥</span>
          </Link>
        </nav>

        {/* Search Bar */}
        <div className="flex-1 max-w-md hidden md:block">
          <form onSubmit={handleSearch} className="relative group">
            <Input
              placeholder="ابحث عن أي منتج بجودة عالية..."
              className="pr-10 bg-accent/50 border-transparent focus:bg-background focus:border-primary/50 transition-all rounded-full h-11 text-sm font-medium shadow-inner"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
              <Search size={20} />
            </button>
          </form>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
          {/* Mobile Search Icon Overlay trigger could go here, but let's keep it simple */}

          {user ? (
            <div className="flex items-center gap-1">
              <Link to="/profile">
                <Button variant="ghost" size="icon" className="h-10 w-10">
                  <User size={22} className="text-primary" />
                </Button>
              </Link>
            </div>
          ) : (
            <Link to="/auth">
              <Button variant="ghost" size="icon" className="h-10 w-10">
                <User size={22} />
              </Button>
            </Link>
          )}

          {/* Wishlist Button */}
          <Link to="/wishlist" className="p-2 rounded-full hover:bg-accent transition-colors hidden md:block">
            <Heart size={24} className="hover:text-destructive transition-colors" />
          </Link>

          {/* Cart with enhanced badge */}
          <Sheet>
            <SheetTrigger asChild>
              <button id="cart-icon-header" className="relative group p-2 rounded-full hover:bg-accent transition-colors">
                <ShoppingBag size={24} className="group-hover:text-primary transition-colors" />
                {itemCount > 0 && (
                  <span className="absolute top-0 right-0 bg-destructive text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-background animate-in zoom-in">
                    {itemCount}
                  </span>
                )}
              </button>
            </SheetTrigger>


            <SheetContent side="left" className="w-full sm:max-w-md overflow-y-auto">
              <SheetHeader>
                <SheetTitle className="text-right">سلة التسوق</SheetTitle>
              </SheetHeader>
              {items.length === 0 ? (
                <p className="text-center text-muted-foreground mt-12">السلة فارغة</p>
              ) : (
                <div className="mt-6 space-y-4">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex gap-3 border-b border-border pb-4">
                      <img
                        src={item.product.images?.[0] || "/placeholder.svg"}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatPrice(item.product.discount_price ?? item.product.price)}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="w-6 h-6 border rounded text-xs">-</button>
                          <span className="text-sm">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="w-6 h-6 border rounded text-xs">+</button>
                          <button onClick={() => removeItem(item.product.id)} className="text-destructive text-xs mr-auto">حذف</button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="border-t border-border pt-4">
                    <div className="flex justify-between font-bold text-lg">
                      <span>المجموع</span>
                      <span>{formatPrice(getTotal())}</span>
                    </div>
                    <Link to="/checkout">
                      <Button className="w-full mt-4" size="lg">إتمام الطلب</Button>
                    </Link>
                  </div>
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Mobile Search Bar - Smoother transition to prevent flickering */}
      <div className={`md:hidden container transition-all duration-300 overflow-hidden ${isCollapsed ? 'h-0 opacity-0 pb-0' : 'h-14 opacity-100 pb-4'}`}>
        <form onSubmit={handleSearch} className="relative group">
          <Input
            placeholder="ابحث عن أي منتج بجودة عالية..."
            className="pr-10 bg-accent/50 border-transparent focus:bg-background focus:border-primary/50 transition-all rounded-full h-11 text-sm font-medium shadow-inner"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
            <Search size={22} />
          </button>
        </form>
      </div>

      {/* Mobile menu dropdown */}

      {mobileMenuOpen && (
        <nav className="md:hidden border-t border-border bg-background animate-fade-in max-h-[80vh] overflow-y-auto">
          <div className="container py-4 space-y-4">
            <div className="space-y-3">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-bold">الرئيسية</Link>
              <Link to="/products" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-bold">كل المنتجات</Link>
              <Link to="/offers" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-bold text-destructive flex items-center gap-2">
                <span>العروض</span>
                <span className="text-xs">🔥</span>
              </Link>
            </div>

            <div className="pt-4 border-t border-border">
              <p className="text-xs font-bold text-muted-foreground mb-3 px-1">الأقسام</p>
              <div className="space-y-4">
                {categoryTree.map((cat: any) => (
                  <div key={cat.id} className="space-y-2">
                    <Link
                      to={`/category/${cat.slug}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-sm font-bold hover:text-primary px-1"
                    >
                      {cat.name}
                    </Link>
                    {cat.children && cat.children.length > 0 && (
                      <div className="grid grid-cols-1 gap-1 mr-4 border-r border-border pr-3">
                        {cat.children.map((child: any) => (
                          <Link
                            key={child.id}
                            to={`/category/${child.slug}`}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block text-xs py-1 hover:text-primary"
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-border space-y-3">
              {user ? (
                <>
                  <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium">الملف الشخصي</Link>
                  <button
                    onClick={async () => {
                      await supabase.auth.signOut();
                      setMobileMenuOpen(false);
                      toast.success("تم تسجيل الخروج");
                    }}
                    className="block text-sm font-medium text-destructive"
                  >
                    تسجيل الخروج
                  </button>
                </>
              ) : (
                <Link to="/auth" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium text-primary">تسجيل الدخول / إنشاء حساب</Link>
              )}
            </div>
          </div>
        </nav>
      )}

    </header>
  );
};

export default Header;
