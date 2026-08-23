import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardShell from "../../components/layout/DashboardShell";
import { adminNav } from "../../components/layout/navConfig";
import { Badge } from "../../components/ui/Primitives";
import AdminTable, { Column } from "../../components/shared/AdminTable";
import { api } from "../../api/client";

const statusTone: Record<string, "neutral" | "success" | "warning" | "danger" | "gold"> = {
  OPEN: "neutral",
  QUOTED: "gold",
  FINALIZED: "warning",
  ACCEPTED: "success",
  CLOSED: "danger",
};

export default function RFQs() {
  const [rfqs, setRfqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.adminRFQs().then((res) => setRfqs(res.data.rfqs)).finally(() => setLoading(false));
  }, []);

  const cols: Column<any>[] = [
    { header: "Product", render: (r) => <Link to={`/admin/rfqs/${r.id}`} className="font-medium text-forest-700 hover:text-gold-600">{r.productName}</Link> },
    { header: "Buyer", render: (r) => r.buyer?.name || "—" },
    { header: "Qty", render: (r) => `${r.quantity} ${r.unit}` },
    { header: "Destination", render: (r) => r.destinationCountry },
    { header: "Quotes", render: (r) => r._count?.quotations ?? 0 },
    { header: "Matched", render: (r) => r._count?.matches ?? 0 },
    { header: "Status", render: (r) => <Badge tone={statusTone[r.status]}>{r.status}</Badge> },
    { header: "", render: (r) => <Link to={`/admin/rfqs/${r.id}`} className="btn-outline !py-1 !px-3 text-xs">Review</Link> },
  ];

  return (
    <DashboardShell navItems={adminNav} sectionLabel="Admin Dashboard" greeting="RFQs & Quotations" subtitle="Every bulk quote request moving through the pipeline.">
      <AdminTable columns={cols} rows={rfqs} loading={loading} emptyTitle="No RFQs yet" />
    </DashboardShell>
  );
}
