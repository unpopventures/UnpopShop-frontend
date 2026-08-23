import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import DashboardShell from "../../components/layout/DashboardShell";
import { adminNav } from "../../components/layout/navConfig";
import { Badge } from "../../components/ui/Primitives";
import AdminTable, { Column } from "../../components/shared/AdminTable";
import { api, apiErrorMessage } from "../../api/client";

export default function Buyers() {
  const [buyers, setBuyers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    api.adminBuyers().then((res) => setBuyers(res.data.buyers)).finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  async function toggleActive(id: string, isActive: boolean) {
    try {
      await api.setUserActive(id, !isActive);
      load();
    } catch (err) {
      toast.error(apiErrorMessage(err));
    }
  }

  const cols: Column<any>[] = [
    { header: "Company", render: (b) => <div><p className="font-medium text-forest-700">{b.buyerProfile?.companyName}</p><p className="text-xs text-forest-400">{b.email}</p></div> },
    { header: "Country", render: (b) => b.buyerProfile?.country || "—" },
    { header: "RFQs", render: (b) => b._count?.rfqs ?? 0 },
    { header: "Enquiries", render: (b) => b._count?.enquiries ?? 0 },
    { header: "Joined", render: (b) => new Date(b.createdAt).toLocaleDateString() },
    { header: "Status", render: (b) => <Badge tone={b.isActive ? "success" : "danger"}>{b.isActive ? "Active" : "Suspended"}</Badge> },
    {
      header: "Action",
      render: (b) => (
        <button onClick={() => toggleActive(b.id, b.isActive)} className="btn-outline !py-1 !px-3 text-xs">
          {b.isActive ? "Suspend" : "Reactivate"}
        </button>
      ),
    },
  ];

  return (
    <DashboardShell navItems={adminNav} sectionLabel="Admin Dashboard" greeting="Buyers" subtitle="All registered buyer accounts.">
      <AdminTable columns={cols} rows={buyers} loading={loading} emptyTitle="No buyers yet" />
    </DashboardShell>
  );
}
