export type Role = "BUYER" | "MANUFACTURER" | "ADMIN";

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  phone?: string | null;
  country?: string | null;
  buyerProfile?: BuyerProfile | null;
  manufacturerProfile?: ManufacturerProfile | null;
}

export interface BuyerProfile {
  id: string;
  companyName: string;
  country: string;
  city?: string | null;
  industry?: string | null;
}

export interface ManufacturerProfile {
  id: string;
  companyName: string;
  description?: string | null;
  logoUrl?: string | null;
  country: string;
  state?: string | null;
  city?: string | null;
  gstNumber?: string | null;
  certifications?: string | null;
  exportMarkets?: string | null;
  productionCapacity?: string | null;
  verificationStatus: "PENDING" | "VERIFIED" | "REJECTED";
  listingLimit: number;
  subscriptionStatus: string;
  subscriptionPlan?: SubscriptionPlan | null;
}

export interface SubscriptionPlan {
  id: string;
  code: string;
  name: string;
  priceInr: number;
  listingLimit: number;
  description?: string | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  _count?: { products: number };
}

export interface Brand {
  id: string;
  manufacturerId: string;
  name: string;
  logoUrl?: string | null;
  description?: string | null;
  state?: string | null;
  manufacturer?: { companyName: string; state?: string | null; country?: string; verificationStatus?: string };
  _count?: { products: number };
}

export interface Product {
  id: string;
  manufacturerId: string;
  name: string;
  description?: string | null;
  images?: string | null;
  moq?: number | null;
  moqUnit: string;
  pricePerUnit?: number | null;
  currency: string;
  packagingOptions?: string | null;
  originState?: string | null;
  originCountry: string;
  certifications?: string | null;
  productionCapacity?: string | null;
  exportMarkets?: string | null;
  availability: boolean;
  status: "DRAFT" | "ACTIVE" | "PAUSED";
  brand?: Brand | null;
  category: Category;
  manufacturer?: { id: string; companyName: string; state?: string | null; country?: string; verificationStatus?: string };
}

export type RFQStatus = "OPEN" | "QUOTED" | "FINALIZED" | "ACCEPTED" | "CLOSED";

export interface FinalQuotation {
  id: string;
  finalPricePerUnit: number;
  currency: string;
  finalTotalPrice: number;
  deliveryTimeline?: string | null;
  terms?: string | null;
  supplierSummary?: string | null;
  status: "SENT" | "ACCEPTED" | "REJECTED";
  sentAt: string;
}

export interface RFQ {
  id: string;
  productName: string;
  category?: Category | null;
  quantity: number;
  unit: string;
  destinationCountry: string;
  specifications?: string | null;
  certificationsRequired?: string | null;
  deliveryTimeline?: string | null;
  additionalRequirements?: string | null;
  status: RFQStatus;
  createdAt: string;
  finalQuotation?: FinalQuotation | null;
  quotationsReceived?: number;
  buyer?: { name: string; email: string; country?: string | null };
}

export interface ManufacturerQuotation {
  id: string;
  rfqId: string;
  pricePerUnit: number;
  currency: string;
  totalPrice: number;
  leadTimeDays: number;
  termsNotes?: string | null;
  certifications?: string | null;
  status: "SUBMITTED" | "SHORTLISTED" | "REJECTED";
  manufacturer?: { id: string; companyName: string; state?: string | null; verificationStatus?: string };
}

export interface Enquiry {
  id: string;
  message: string;
  status: "OPEN" | "RESPONDED" | "CLOSED";
  createdAt: string;
  product: { name: string; manufacturer?: { companyName: string } };
}

export interface Order {
  id: string;
  quantity: number;
  unit: string;
  totalAmount: number;
  currency: string;
  status: string;
  createdAt: string;
  manufacturer?: { companyName: string };
  product?: { name: string } | null;
}

export interface DemandPoint {
  country: string;
  requestCount: number;
  totalQuantity: number;
  level: "High" | "Medium" | "Low";
}

export interface SupplyPoint {
  region: string;
  manufacturerCount: number;
  level: "High" | "Medium" | "Low";
}
