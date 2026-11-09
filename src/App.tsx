import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/shared/ProtectedRoute";

// Public
import Home from "./pages/public/Home";
import Login from "./pages/public/Login";
import RegisterBuyer from "./pages/public/RegisterBuyer";
import RegisterManufacturer from "./pages/public/RegisterManufacturer";
import ManufacturersLanding from "./pages/public/ManufacturersLanding";
import ProductsBrowse from "./pages/public/ProductsBrowse";
import ProductDetail from "./pages/public/ProductDetail";
import BrandsBrowse from "./pages/public/BrandsBrowse";
import BrandDetail from "./pages/public/BrandDetail";

// Buyer
import BuyerOverview from "./pages/buyer/BuyerOverview";
import DiscoverBrands from "./pages/buyer/DiscoverBrands";
import BuyerProducts from "./pages/buyer/BuyerProducts";
import BulkQuote from "./pages/buyer/BulkQuote";
import MyInquiries from "./pages/buyer/MyInquiries";
import BuyerOrders from "./pages/buyer/BuyerOrders";
import Favorites from "./pages/buyer/Favorites";
import SupplyMap from "./pages/buyer/SupplyMap";
import BuyerMessages from "./pages/buyer/Messages";
import BuyerSettings from "./pages/buyer/AccountSettings";

// Manufacturer
import ManufacturerOverview from "./pages/manufacturer/ManufacturerOverview";
import MyProfile from "./pages/manufacturer/MyProfile";
import MyProducts from "./pages/manufacturer/MyProducts";
import OrdersLeads from "./pages/manufacturer/OrdersLeads";
import MarketInsights from "./pages/manufacturer/MarketInsights";
import Promotions from "./pages/manufacturer/Promotions";
import ManufacturerMessages from "./pages/manufacturer/Messages";
import ManufacturerSettings from "./pages/manufacturer/AccountSettings";

// Admin
import AdminOverview from "./pages/admin/AdminOverview";
import Buyers from "./pages/admin/Buyers";
import Manufacturers from "./pages/admin/Manufacturers";
import AdminBrands from "./pages/admin/Brands";
import AdminProducts from "./pages/admin/Products";
import Categories from "./pages/admin/Categories";
import RFQs from "./pages/admin/RFQs";
import RFQDetail from "./pages/admin/RFQDetail";
import Subscriptions from "./pages/admin/Subscriptions";
import Leads from "./pages/admin/Leads";

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register/buyer" element={<RegisterBuyer />} />
      <Route path="/register/manufacturer" element={<RegisterManufacturer />} />
      <Route path="/manufacturers" element={<ManufacturersLanding />} />
      <Route path="/products" element={<ProductsBrowse />} />
      <Route path="/products/:id" element={<ProductDetail />} />
      <Route path="/brands" element={<BrandsBrowse />} />
      <Route path="/brands/:id" element={<BrandDetail />} />
      <Route path="/bulk-quote" element={<ProtectedRoute roles={["BUYER"]}><BulkQuote /></ProtectedRoute>} />

      {/* Buyer */}
      <Route path="/buyer" element={<ProtectedRoute roles={["BUYER"]}><BuyerOverview /></ProtectedRoute>} />
      <Route path="/buyer/brands" element={<ProtectedRoute roles={["BUYER"]}><DiscoverBrands /></ProtectedRoute>} />
      <Route path="/buyer/products" element={<ProtectedRoute roles={["BUYER"]}><BuyerProducts /></ProtectedRoute>} />
      <Route path="/buyer/bulk-quote" element={<ProtectedRoute roles={["BUYER"]}><BulkQuote /></ProtectedRoute>} />
      <Route path="/buyer/inquiries" element={<ProtectedRoute roles={["BUYER"]}><MyInquiries /></ProtectedRoute>} />
      <Route path="/buyer/orders" element={<ProtectedRoute roles={["BUYER"]}><BuyerOrders /></ProtectedRoute>} />
      <Route path="/buyer/favorites" element={<ProtectedRoute roles={["BUYER"]}><Favorites /></ProtectedRoute>} />
      <Route path="/buyer/supply-map" element={<ProtectedRoute roles={["BUYER"]}><SupplyMap /></ProtectedRoute>} />
      <Route path="/buyer/messages" element={<ProtectedRoute roles={["BUYER"]}><BuyerMessages /></ProtectedRoute>} />
      <Route path="/buyer/settings" element={<ProtectedRoute roles={["BUYER"]}><BuyerSettings /></ProtectedRoute>} />

      {/* Manufacturer */}
      <Route path="/manufacturer" element={<ProtectedRoute roles={["MANUFACTURER"]}><ManufacturerOverview /></ProtectedRoute>} />
      <Route path="/manufacturer/profile" element={<ProtectedRoute roles={["MANUFACTURER"]}><MyProfile /></ProtectedRoute>} />
      <Route path="/manufacturer/products" element={<ProtectedRoute roles={["MANUFACTURER"]}><MyProducts /></ProtectedRoute>} />
      <Route path="/manufacturer/leads" element={<ProtectedRoute roles={["MANUFACTURER"]}><OrdersLeads /></ProtectedRoute>} />
      <Route path="/manufacturer/market-insights" element={<ProtectedRoute roles={["MANUFACTURER"]}><MarketInsights /></ProtectedRoute>} />
      <Route path="/manufacturer/subscription" element={<ProtectedRoute roles={["MANUFACTURER"]}><Promotions /></ProtectedRoute>} />
      <Route path="/manufacturer/messages" element={<ProtectedRoute roles={["MANUFACTURER"]}><ManufacturerMessages /></ProtectedRoute>} />
      <Route path="/manufacturer/settings" element={<ProtectedRoute roles={["MANUFACTURER"]}><ManufacturerSettings /></ProtectedRoute>} />

      {/* Admin */}
      <Route path="/admin" element={<ProtectedRoute roles={["ADMIN"]}><AdminOverview /></ProtectedRoute>} />
      <Route path="/admin/buyers" element={<ProtectedRoute roles={["ADMIN"]}><Buyers /></ProtectedRoute>} />
      <Route path="/admin/manufacturers" element={<ProtectedRoute roles={["ADMIN"]}><Manufacturers /></ProtectedRoute>} />
      <Route path="/admin/brands" element={<ProtectedRoute roles={["ADMIN"]}><AdminBrands /></ProtectedRoute>} />
      <Route path="/admin/products" element={<ProtectedRoute roles={["ADMIN"]}><AdminProducts /></ProtectedRoute>} />
      <Route path="/admin/categories" element={<ProtectedRoute roles={["ADMIN"]}><Categories /></ProtectedRoute>} />
      <Route path="/admin/rfqs" element={<ProtectedRoute roles={["ADMIN"]}><RFQs /></ProtectedRoute>} />
      <Route path="/admin/rfqs/:id" element={<ProtectedRoute roles={["ADMIN"]}><RFQDetail /></ProtectedRoute>} />
      <Route path="/admin/subscriptions" element={<ProtectedRoute roles={["ADMIN"]}><Subscriptions /></ProtectedRoute>} />
      <Route path="/admin/leads" element={<ProtectedRoute roles={["ADMIN"]}><Leads /></ProtectedRoute>} />

      <Route path="*" element={<Home />} />
    </Routes>
  );
}
