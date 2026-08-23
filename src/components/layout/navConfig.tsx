import {
  LayoutDashboard, User, Package, ShoppingCart, LineChart, Megaphone, MessageSquare,
  Settings, Compass, Heart, Send, MapPinned, Users, Factory, Boxes, ListChecks,
  FileText, CreditCard, ShieldCheck, Inbox,
} from "lucide-react";
import { NavItem } from "./DashboardShell";

const icon = { size: 17 };

export const buyerNav: NavItem[] = [
  { label: "Overview", to: "/buyer", icon: <LayoutDashboard {...icon} /> },
  { label: "Discover Brands", to: "/buyer/brands", icon: <Compass {...icon} /> },
  { label: "Products", to: "/buyer/products", icon: <Package {...icon} /> },
  { label: "Bulk Quote / RFQ", to: "/buyer/bulk-quote", icon: <Send {...icon} /> },
  { label: "My Inquiries", to: "/buyer/inquiries", icon: <Inbox {...icon} /> },
  { label: "Orders", to: "/buyer/orders", icon: <ShoppingCart {...icon} /> },
  { label: "Favorites", to: "/buyer/favorites", icon: <Heart {...icon} /> },
  { label: "Supply Map", to: "/buyer/supply-map", icon: <MapPinned {...icon} /> },
  { label: "Messages", to: "/buyer/messages", icon: <MessageSquare {...icon} /> },
  { label: "Account Settings", to: "/buyer/settings", icon: <Settings {...icon} /> },
];

export const manufacturerNav: NavItem[] = [
  { label: "Overview", to: "/manufacturer", icon: <LayoutDashboard {...icon} /> },
  { label: "My Profile", to: "/manufacturer/profile", icon: <User {...icon} /> },
  { label: "My Products", to: "/manufacturer/products", icon: <Package {...icon} /> },
  { label: "Orders & Leads", to: "/manufacturer/leads", icon: <ListChecks {...icon} /> },
  { label: "Market Insights", to: "/manufacturer/market-insights", icon: <LineChart {...icon} /> },
  { label: "Subscription", to: "/manufacturer/subscription", icon: <Megaphone {...icon} /> },
  { label: "Messages", to: "/manufacturer/messages", icon: <MessageSquare {...icon} /> },
  { label: "Account Settings", to: "/manufacturer/settings", icon: <Settings {...icon} /> },
];

export const adminNav: NavItem[] = [
  { label: "Overview", to: "/admin", icon: <LayoutDashboard {...icon} /> },
  { label: "Buyers", to: "/admin/buyers", icon: <Users {...icon} /> },
  { label: "Manufacturers", to: "/admin/manufacturers", icon: <Factory {...icon} /> },
  { label: "Brands", to: "/admin/brands", icon: <Boxes {...icon} /> },
  { label: "Products", to: "/admin/products", icon: <Package {...icon} /> },
  { label: "Categories", to: "/admin/categories", icon: <ListChecks {...icon} /> },
  { label: "RFQs & Quotations", to: "/admin/rfqs", icon: <FileText {...icon} /> },
  { label: "Subscriptions", to: "/admin/subscriptions", icon: <CreditCard {...icon} /> },
  { label: "Product Leads", to: "/admin/leads", icon: <ShieldCheck {...icon} /> },
];
