import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, HashRouter, Navigate, Route, Routes, useParams } from "react-router-dom";
import { Capacitor } from "@capacitor/core";
import BottomNav from "./components/BottomNav";

// استيراد مباشر لتفادي مشاكل التحميل في Capacitor WebView
import HomePage from "./pages/marketing/HomePage";
import CatalogPage from "./pages/marketing/CatalogPage";
import ProductPage from "./pages/marketing/ProductPage";
import WholesalePage from "./pages/marketing/WholesalePage";
import CustomOrderPage from "./pages/marketing/CustomOrderPage";
import AboutPage from "./pages/marketing/AboutPage";
import ContactPage from "./pages/marketing/ContactPage";
import RequestQuotePage from "./pages/marketing/RequestQuotePage";
import PrivacyPage from "./pages/marketing/PrivacyPage";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import ThankYou from "./pages/ThankYou";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
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
import AdminLeads from "./pages/admin/Leads";
import AgentOrders from "./pages/AgentOrders";
import AdminLayout from "./components/AdminLayout";
import FlyingCartAnimation from "./components/FlyingCartAnimation";
import { NotificationHub } from "./components/NotificationHub";
import CapacitorAppWrapper from "./components/CapacitorAppWrapper";
import InternalOnly from "./pages/InternalOnly";
import { features } from "./config/features";

const queryClient = new QueryClient();

/** Marketing site and direct checkout are separate gates. Both default off. */
const marketing = (page: React.ReactElement) => (features.publicSite ? page : <InternalOnly />);
const checkout = (page: React.ReactElement) => (features.directCheckout ? page : <InternalOnly />);

function CategoryRedirect() {
  const { slug } = useParams();
  return <Navigate to={`/products?category=${encodeURIComponent(slug ?? "")}`} replace />;
}

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
            <Route path="/" element={marketing(<HomePage />)} />
            <Route path="/products" element={marketing(<CatalogPage />)} />
            <Route path="/products/:slug" element={marketing(<ProductPage />)} />
            <Route path="/product/:slug" element={marketing(<ProductPage />)} />
            <Route path="/category/:slug" element={marketing(<CategoryRedirect />)} />
            <Route path="/wholesale" element={marketing(<WholesalePage />)} />
            <Route path="/custom-orders" element={marketing(<CustomOrderPage />)} />
            <Route path="/about" element={marketing(<AboutPage />)} />
            <Route path="/contact" element={marketing(<ContactPage />)} />
            <Route path="/request-quote" element={marketing(<RequestQuotePage />)} />
            <Route path="/privacy" element={marketing(<PrivacyPage />)} />
            <Route path="/support" element={marketing(<ContactPage />)} />

            <Route path="/cart" element={checkout(<Cart />)} />
            <Route path="/offers" element={checkout(<Offers />)} />
            <Route path="/checkout" element={checkout(<Checkout />)} />
            <Route path="/thank-you" element={checkout(<ThankYou />)} />
            <Route path="/auth" element={checkout(<Auth />)} />
            <Route path="/profile" element={checkout(<Profile />)} />
            <Route path="/track-order" element={checkout(<TrackOrder />)} />
            <Route path="/wishlist" element={checkout(<Wishlist />)} />

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
            <Route path="/admin/leads" element={<AdminLayout><AdminLeads /></AdminLayout>} />
            <Route path="/agent/orders" element={checkout(<AgentOrders />)} />


            <Route path="*" element={features.publicSite ? <NotFound /> : <InternalOnly />} />
          </Routes>
        <BottomNav />
        </CapacitorAppWrapper>
      </AppRouter>
    </TooltipProvider>
  </QueryClientProvider>
);


export default App;
