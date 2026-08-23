import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import DashboardShell from "../../components/layout/DashboardShell";
import { adminNav } from "../../components/layout/navConfig";
import { Badge } from "../../components/ui/Primitives";
import AdminTable, { Column } from "../../components/shared/AdminTable";
import { api, apiErrorMessage } from "../../api/client";

export default function Manufacturers() {
  const [manufacturers, setManufacturers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
      <AdminTable columns={cols} rows={manufacturers} loading={loading} emptyTitle="No manufacturers yet" />
    </DashboardShell>
  );
}
