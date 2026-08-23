import { useEffect, useState } from "react";
import DashboardShell from "../../components/layout/DashboardShell";
import { adminNav } from "../../components/layout/navConfig";
import { Badge } from "../../components/ui/Primitives";
import AdminTable, { Column } from "../../components/shared/AdminTable";
import { api } from "../../api/client";
import { Product } from "../../types";

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.adminAllProducts().then((res) => setProducts(res.data.products)).finally(() => setLoading(false));
  }, []);

  const cols: Column<Product>[] = [
    { header: "Product", render: (p) => p.name },
    { header: "Category", render: (p) => p.category?.name },
    { header: "Manufacturer", render: (p: any) => p.manufacturer?.companyName || "—" },
    { header: "Price", render: (p) => (p.pricePerUnit ? `${p.currency} ${p.pricePerUnit}/${p.moqUnit}` : "On request") },
    { header: "Status", render: (p) => <Badge tone={p.status === "ACTIVE" ? "success" : p.status === "PAUSED" ? "warning" : "neutral"}>{p.status}</Badge> },
  ];

  return (
    <DashboardShell navItems={adminNav} sectionLabel="Admin Dashboard" greeting="Products" subtitle="Every product listed across all manufacturers.">
      <AdminTable columns={cols} rows={products} loading={loading} emptyTitle="No products yet" />
    </DashboardShell>
  );
}
