import { useEffect, useState } from "react";
import DashboardShell from "../../components/layout/DashboardShell";
import { adminNav } from "../../components/layout/navConfig";
import AdminTable, { Column } from "../../components/shared/AdminTable";
import { api } from "../../api/client";
import { Brand } from "../../types";

export default function AdminBrands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.brands().then((res) => setBrands(res.data.brands)).finally(() => setLoading(false));
  }, []);

  const cols: Column<Brand>[] = [
    { header: "Brand", render: (b) => b.name },
    { header: "Manufacturer", render: (b) => b.manufacturer?.companyName || "—" },
    { header: "Location", render: (b) => b.state || b.manufacturer?.state || "—" },
    { header: "Products", render: (b) => b._count?.products ?? 0 },
  ];

  return (
    <DashboardShell navItems={adminNav} sectionLabel="Admin Dashboard" greeting="Brands" subtitle="Every brand listed on Unpop.shop.">
      <AdminTable columns={cols} rows={brands} loading={loading} emptyTitle="No brands yet" />
    </DashboardShell>
  );
}
