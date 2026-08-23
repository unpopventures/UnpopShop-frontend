import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("unpop_token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("unpop_token");
      localStorage.removeItem("unpop_user");
    }
    return Promise.reject(error);
  }
);

export function apiErrorMessage(err: any): string {
  return err?.response?.data?.message || "Something went wrong. Please try again.";
}

export const api = {
  // Auth
  registerBuyer: (data: any) => axiosInstance.post("/auth/register/buyer", data),
  registerManufacturer: (data: any) => axiosInstance.post("/auth/register/manufacturer", data),
  login: (data: any) => axiosInstance.post("/auth/login", data),
  me: () => axiosInstance.get("/auth/me"),

  // Public
  homepage: () => axiosInstance.get("/public/homepage"),
  submitLead: (data: any) => axiosInstance.post("/public/leads", data),
  adminLeads: () => axiosInstance.get("/public/leads"),

  // Catalog
  categories: () => axiosInstance.get("/categories"),
  createCategory: (data: any) => axiosInstance.post("/categories", data),
  deleteCategory: (id: string) => axiosInstance.delete(`/categories/${id}`),

  brands: (q?: string) => axiosInstance.get("/brands", { params: { q } }),
  brand: (id: string) => axiosInstance.get(`/brands/${id}`),
  myBrands: () => axiosInstance.get("/brands/mine"),
  createBrand: (data: any) => axiosInstance.post("/brands", data),
  updateBrand: (id: string, data: any) => axiosInstance.patch(`/brands/${id}`, data),

  searchProducts: (params: any) => axiosInstance.get("/products", { params }),
  product: (id: string) => axiosInstance.get(`/products/${id}`),
  myProducts: () => axiosInstance.get("/products/mine"),
  createProduct: (data: any) => axiosInstance.post("/products", data),
  updateProduct: (id: string, data: any) => axiosInstance.patch(`/products/${id}`, data),
  deleteProduct: (id: string) => axiosInstance.delete(`/products/${id}`),
  adminAllProducts: () => axiosInstance.get("/products/admin/all"),

  // RFQ / quotations
  createRFQ: (data: any) => axiosInstance.post("/rfqs", data),
  myRFQs: () => axiosInstance.get("/rfqs/mine"),
  myRFQ: (id: string) => axiosInstance.get(`/rfqs/mine/${id}`),
  respondToFinalQuotation: (id: string, accept: boolean) => axiosInstance.post(`/rfqs/mine/${id}/respond`, { accept }),

  matchedRFQs: () => axiosInstance.get("/rfqs/matched"),
  myQuotations: () => axiosInstance.get("/rfqs/matched/quotations"),
  submitQuotation: (rfqId: string, data: any) => axiosInstance.post(`/rfqs/${rfqId}/quotations`, data),

  adminRFQs: () => axiosInstance.get("/rfqs/admin"),
  adminRFQ: (id: string) => axiosInstance.get(`/rfqs/admin/${id}`),
  adminUpdateQuotationStatus: (quotationId: string, status: string) =>
    axiosInstance.patch(`/rfqs/admin/quotations/${quotationId}`, { status }),
  adminSendFinalQuotation: (rfqId: string, data: any) => axiosInstance.post(`/rfqs/admin/${rfqId}/final-quotation`, data),

  // Buyer
  buyerOverview: () => axiosInstance.get("/buyer/overview"),
  favorites: () => axiosInstance.get("/buyer/favorites"),
  addFavorite: (productId: string) => axiosInstance.post("/buyer/favorites", { productId }),
  removeFavorite: (productId: string) => axiosInstance.delete(`/buyer/favorites/${productId}`),
  createEnquiry: (data: any) => axiosInstance.post("/buyer/enquiries", data),
  myEnquiries: () => axiosInstance.get("/buyer/enquiries"),
  myOrders: () => axiosInstance.get("/buyer/orders"),
  supplyMap: (params: any) => axiosInstance.get("/buyer/supply-map", { params }),

  // Manufacturer
  manufacturerProfile: () => axiosInstance.get("/manufacturer/profile"),
  updateManufacturerProfile: (data: any) => axiosInstance.patch("/manufacturer/profile", data),
  manufacturerOverview: () => axiosInstance.get("/manufacturer/overview"),
  demandMap: (params: any) => axiosInstance.get("/manufacturer/demand-map", { params }),

  // Subscriptions
  plans: () => axiosInstance.get("/subscriptions"),
  createPlan: (data: any) => axiosInstance.post("/subscriptions", data),
  updatePlan: (id: string, data: any) => axiosInstance.patch(`/subscriptions/${id}`, data),
  subscribe: (planId: string) => axiosInstance.post("/subscriptions/subscribe", { planId }),

  // Admin
  adminOverview: () => axiosInstance.get("/admin/overview"),
  adminBuyers: () => axiosInstance.get("/admin/buyers"),
  adminManufacturers: () => axiosInstance.get("/admin/manufacturers"),
  setManufacturerVerification: (id: string, status: string) =>
    axiosInstance.patch(`/admin/manufacturers/${id}/verification`, { status }),
  setUserActive: (id: string, isActive: boolean) => axiosInstance.patch(`/admin/users/${id}/active`, { isActive }),

  // Messages
  threads: () => axiosInstance.get("/messages/threads"),
  thread: (counterpartId: string, rfqId?: string) => axiosInstance.get("/messages/thread", { params: { counterpartId, rfqId } }),
  sendMessage: (data: any) => axiosInstance.post("/messages", data),
};
