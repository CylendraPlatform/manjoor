import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, HashRouter, Routes, Route } from "react-router-dom";
import { Capacitor } from "@capacitor/core";
import BottomNav from "./components/BottomNav";

// استيراد مباشر لتفادي مشاكل التحميل في Capacitor WebView
import Index from "./pages/Index";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout";
import ThankYou from "./pages/ThankYou";
import Privacy from "./pages/Privacy";
import Support from "./pages/Support";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Category from "./pages/Category";
import Offers from "./pages/Offers";
import TrackOrder from "./pages/TrackOrder";
import Wishlist from "./pages/Wishlist";
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminOrders from "./pages/admin/Orders";
import AdminOrderDetail from "./pages/admin/OrderDetail";
import AdminProducts from "./pages/admin/Products";
import AdminProductForm from "./pages/admin/ProductForm";
import AdminCategories from "./pages/admin/Categories";
import AdminInventory from "./pages/admin/Inventory";
import AdminDelivery from "./pages/admin/Delivery";
import AdminCoupons from "./pages/admin/Coupons";
import AdminAgents from "./pages/admin/Agents";
import AdminUsers from "./pages/admin/Users";
import AdminLoyalty from "./pages/admin/Loyalty";
import AgentOrders from "./pages/AgentOrders";
import AdminLayout from "./components/AdminLayout";
import FlyingCartAnimation from "./components/FlyingCartAnimation";
import { NotificationHub } from "./components/NotificationHub";
import CapacitorAppWrapper from "./components/CapacitorAppWrapper";
import InternalOnly from "./pages/InternalOnly";
import { publicSalesEnabled } from "./config/bounty";

const queryClient = new QueryClient();

/** Public commerce is opt-in and disabled for this internal staging copy. */
const publicPage = (page: React.ReactElement) => publicSalesEnabled ? page : <InternalOnly />;

/** الويب (بما فيه Netlify): مسارات حقيقية /admin/... — تطبيق Capacitor فقط يستخدم #/... */
const AppRouter = Capacitor.getPlatform() === "web" ? BrowserRouter : HashRouter;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <FlyingCartAnimation />
      <AppRouter>
        <CapacitorAppWrapper>
        <NotificationHub />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={publicPage(<Index />)} />
            <Route path="/products" element={publicPage(<Products />)} />
            <Route path="/cart" element={publicPage(<Cart />)} />
            <Route path="/offers" element={publicPage(<Offers />)} />
            <Route path="/product/:slug" element={publicPage(<ProductDetail />)} />

            <Route path="/checkout" element={publicPage(<Checkout />)} />
            <Route path="/thank-you" element={publicPage(<ThankYou />)} />
            <Route path="/privacy" element={publicPage(<Privacy />)} />
            <Route path="/support" element={publicPage(<Support />)} />
            <Route path="/auth" element={publicPage(<Auth />)} />
            <Route path="/profile" element={publicPage(<Profile />)} />
            <Route path="/category/:slug" element={publicPage(<Category />)} />
            <Route path="/track-order" element={publicPage(<TrackOrder />)} />
            <Route path="/wishlist" element={publicPage(<Wishlist />)} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <AdminLayout>
                  <AdminOrders />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/orders/:id"
              element={
                <AdminLayout>
                  <AdminOrderDetail />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/products"
              element={
                <AdminLayout>
                  <AdminProducts />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/products/new"
              element={
                <AdminLayout>
                  <AdminProductForm />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/products/:id/edit"
              element={
                <AdminLayout>
                  <AdminProductForm />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/categories"
              element={
                <AdminLayout>
                  <AdminCategories />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/inventory"
              element={
                <AdminLayout>
                  <AdminInventory />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/delivery"
              element={
                <AdminLayout>
                  <AdminDelivery />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/coupons"
              element={
                <AdminLayout>
                  <AdminCoupons />
                </AdminLayout>
              }
            />
            <Route path="/admin/agents" element={<AdminLayout><AdminAgents /></AdminLayout>} />
            <Route path="/admin/users" element={<AdminLayout><AdminUsers /></AdminLayout>} />
            <Route path="/admin/loyalty" element={<AdminLayout><AdminLoyalty /></AdminLayout>} />
            <Route path="/agent/orders" element={publicPage(<AgentOrders />)} />


            <Route path="*" element={publicPage(<NotFound />)} />
          </Routes>
        <BottomNav />
        </CapacitorAppWrapper>
      </AppRouter>
    </TooltipProvider>
  </QueryClientProvider>
);


export default App;
