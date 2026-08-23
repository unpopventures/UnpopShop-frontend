import { useEffect, useState } from "react";
import DashboardShell from "../../components/layout/DashboardShell";
import { adminNav } from "../../components/layout/navConfig";
import { Badge } from "../../components/ui/Primitives";
import AdminTable, { Column } from "../../components/shared/AdminTable";
import { api } from "../../api/client";

export default function Leads() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.adminLeads().then((res) => setLeads(res.data.leads)).finally(() => setLoading(false));
  }, []);

  const cols: Column<any>[] = [
    { header: "Name", render: (l) => l.name },
    { header: "Business", render: (l) => l.business },
    { header: "Location", render: (l) => l.location },
    { header: "Phone", render: (l) => l.phone },
    { header: "Description", render: (l) => <span className="line-clamp-2 max-w-xs text-forest-500">{l.description}</span> },
    { header: "Submitted", render: (l) => new Date(l.createdAt).toLocaleDateString() },
    { header: "Status", render: (l) => <Badge tone="neutral">{l.status}</Badge> },
  ];

  return (
    <DashboardShell navItems={adminNav} sectionLabel="Admin Dashboard" greeting="Product Leads" subtitle="Homegrown product interest submitted from the homepage.">
      <AdminTable columns={cols} rows={leads} loading={loading} emptyTitle="No leads yet" />
    </DashboardShell>
  );
}
