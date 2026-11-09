import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import DashboardShell from "../../components/layout/DashboardShell";
import { adminNav } from "../../components/layout/navConfig";
import { Badge, Card } from "../../components/ui/Primitives";
import AdminTable, { Column } from "../../components/shared/AdminTable";
import { api, apiErrorMessage } from "../../api/client";

export default function Manufacturers() {
  const [manufacturers, setManufacturers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  function load() {
    setLoading(true);
    api.adminManufacturers().then((res) => setManufacturers(res.data.manufacturers)).finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  async function setStatus(id: string, status: string) {
    try {
      await api.setManufacturerVerification(id, status);
      toast.success(`Marked as ${status.toLowerCase()}.`);
      load();
    } catch (err) {
      toast.error(apiErrorMessage(err));
    }
  }

  const tone: Record<string, "success" | "warning" | "danger"> = { VERIFIED: "success", PENDING: "warning", REJECTED: "danger" };
  const filtered = manufacturers.filter((m) => {
    const term = query.trim().toLowerCase();
    const matches = !term || [m.companyName, m.user?.email, m.user?.name, m.city, m.state, m.country]
      .some((value) => String(value || "").toLowerCase().includes(term));
    return matches && (statusFilter === "ALL" || m.verificationStatus === statusFilter);
  });
  const pendingCount = manufacturers.filter((m) => m.verificationStatus === "PENDING").length;

  const cols: Column<any>[] = [
    { header: "Company", render: (m) => <div><p className="font-medium text-forest-700">{m.companyName}</p><p className="text-xs text-forest-400">{m.user?.email}</p></div> },
    { header: "Location", render: (m) => `${m.state || ""} ${m.country || ""}`.trim() || "—" },
    { header: "Plan", render: (m) => m.subscriptionPlan?.name || "—" },
    { header: "Products", render: (m) => m._count?.products ?? 0 },
    { header: "Status", render: (m) => <Badge tone={tone[m.verificationStatus]}>{m.verificationStatus}</Badge> },
    {
      header: "Action",
      render: (m) => (
        <div className="flex gap-2">
          {m.verificationStatus !== "VERIFIED" && (
            <button onClick={() => setStatus(m.id, "VERIFIED")} className="btn-primary !py-1 !px-3 text-xs">Verify</button>
          )}
          {m.verificationStatus !== "REJECTED" && (
            <button onClick={() => setStatus(m.id, "REJECTED")} className="btn-outline !py-1 !px-3 text-xs text-red-500">Reject</button>
          )}
        </div>
      ),
    },
  ];

  return (
    <DashboardShell navItems={adminNav} sectionLabel="Admin Dashboard" greeting="Manufacturers" subtitle="Verify manufacturers and monitor their catalog.">
      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <Card className="p-4"><p className="text-xs text-forest-400">Total manufacturers</p><p className="mt-1 text-2xl font-semibold text-forest-700">{manufacturers.length}</p></Card>
        <Card className="p-4"><p className="text-xs text-forest-400">Awaiting review</p><p className="mt-1 text-2xl font-semibold text-forest-700">{pendingCount}</p></Card>
        <Card className="p-4"><p className="text-xs text-forest-400">Verified</p><p className="mt-1 text-2xl font-semibold text-forest-700">{manufacturers.filter((m) => m.verificationStatus === "VERIFIED").length}</p></Card>
      </div>
      <Card className="mb-4 flex flex-col gap-3 p-4 sm:flex-row">
        <input className="input flex-1" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search company, contact, email or location" aria-label="Search manufacturers" />
        <select className="input sm:max-w-xs" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} aria-label="Filter by verification status">
          <option value="ALL">All statuses</option><option value="PENDING">Pending review</option><option value="VERIFIED">Verified</option><option value="REJECTED">Rejected</option>
        </select>
      </Card>
      <AdminTable columns={cols} rows={filtered} loading={loading} emptyTitle="No matching manufacturers" />
    </DashboardShell>
  );
}
