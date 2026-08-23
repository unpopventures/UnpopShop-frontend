import { useEffect, useState, FormEvent } from "react";
import { toast } from "react-toastify";
import { Plus } from "lucide-react";
import DashboardShell from "../../components/layout/DashboardShell";
import { adminNav } from "../../components/layout/navConfig";
import { Card, Badge, LoadingBlock } from "../../components/ui/Primitives";
import AdminTable, { Column } from "../../components/shared/AdminTable";
import { api, apiErrorMessage } from "../../api/client";
import { SubscriptionPlan } from "../../types";

const initial = { code: "", name: "", priceInr: "", listingLimit: "", description: "" };

export default function Subscriptions() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [manufacturers, setManufacturers] = useState<any[]>([]);
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  function load() {
    setLoading(true);
    Promise.all([api.plans(), api.adminManufacturers()]).then(([p, m]) => {
      setPlans(p.data.plans);
      setManufacturers(m.data.manufacturers);
    }).finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.createPlan({
        code: form.code,
        name: form.name,
        priceInr: Number(form.priceInr),
        listingLimit: Number(form.listingLimit),
        description: form.description,
      });
      toast.success("Plan created.");
      setForm(initial);
      load();
    } catch (err) {
      toast.error(apiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  const cols: Column<any>[] = [
    { header: "Company", render: (m) => m.companyName },
    { header: "Plan", render: (m) => m.subscriptionPlan?.name || "—" },
    { header: "Listing limit", render: (m) => m.listingLimit },
    { header: "Products used", render: (m) => m._count?.products ?? 0 },
    { header: "Status", render: (m) => <Badge tone={m.subscriptionStatus === "active" ? "success" : "neutral"}>{m.subscriptionStatus}</Badge> },
  ];

  return (
    <DashboardShell navItems={adminNav} sectionLabel="Admin Dashboard" greeting="Subscriptions" subtitle="Plan catalog and manufacturer subscription status.">
      <div className="mb-8 grid gap-5 lg:grid-cols-3">
        {plans.map((p) => (
          <Card key={p.id} className="p-5">
            <h3 className="font-display text-base text-forest-700">{p.name}</h3>
            <p className="mt-1 text-xl font-display font-semibold text-forest-700">
              {p.priceInr === 0 ? "Free" : `₹${p.priceInr.toLocaleString()}/mo`}
            </p>
            <p className="mt-1 text-sm text-forest-400">Up to {p.listingLimit} active listings</p>
            {p.description && <p className="mt-2 text-xs text-forest-400">{p.description}</p>}
          </Card>
        ))}

        <Card className="p-5">
          <h3 className="mb-3 font-display text-base text-forest-700">Add a new plan</h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input required placeholder="Code (e.g. scale)" className="input" value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))} />
            <input required placeholder="Name" className="input" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            <div className="flex gap-2">
              <input required type="number" placeholder="Price (₹/mo)" className="input" value={form.priceInr} onChange={(e) => setForm((f) => ({ ...f, priceInr: e.target.value }))} />
              <input required type="number" placeholder="Listing limit" className="input" value={form.listingLimit} onChange={(e) => setForm((f) => ({ ...f, listingLimit: e.target.value }))} />
            </div>
            <textarea placeholder="Description" rows={2} className="input" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
            <button type="submit" disabled={saving} className="btn-primary w-full"><Plus size={15} /> {saving ? "Saving..." : "Add plan"}</button>
          </form>
        </Card>
      </div>

      <h3 className="mb-3 font-display text-base text-forest-700">Manufacturer subscriptions</h3>
      {loading ? <LoadingBlock /> : <AdminTable columns={cols} rows={manufacturers} emptyTitle="No manufacturers yet" />}
    </DashboardShell>
  );
}
