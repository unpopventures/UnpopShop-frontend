import { useEffect, useState, FormEvent } from "react";
import { toast } from "react-toastify";
import DashboardShell from "../../components/layout/DashboardShell";
import { manufacturerNav } from "../../components/layout/navConfig";
import { Card, Badge, LoadingBlock } from "../../components/ui/Primitives";
import { api, apiErrorMessage } from "../../api/client";

const initial = {
  companyName: "",
  description: "",
  state: "",
  city: "",
  gstNumber: "",
  certifications: "",
  exportMarkets: "",
  productionCapacity: "",
};

export default function MyProfile() {
  const [form, setForm] = useState(initial);
  const [status, setStatus] = useState<string>("PENDING");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api
      .manufacturerProfile()
      .then((res) => {
        const p = res.data.profile;
        setForm({
          companyName: p.companyName || "",
          description: p.description || "",
          state: p.state || "",
          city: p.city || "",
          gstNumber: p.gstNumber || "",
          certifications: p.certifications || "",
          exportMarkets: p.exportMarkets || "",
          productionCapacity: p.productionCapacity || "",
        });
        setStatus(p.verificationStatus);
      })
      .finally(() => setLoading(false));
  }, []);

  function update<K extends keyof typeof initial>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateManufacturerProfile(form);
      toast.success("Profile updated.");
    } catch (err) {
      toast.error(apiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <LoadingBlock />;

  return (
    <DashboardShell navItems={manufacturerNav} sectionLabel="Brand Dashboard" greeting="My Profile" subtitle="This is what buyers see about your company.">
      <Card className="max-w-2xl p-6">
        <div className="mb-5 flex items-center justify-between">
          <p className="text-sm text-forest-400">Verification status</p>
          <Badge tone={status === "VERIFIED" ? "success" : status === "REJECTED" ? "danger" : "warning"}>{status}</Badge>
        </div>
        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="label">Company name</label>
            <input className="input" value={form.companyName} onChange={(e) => update("companyName", e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Company description</label>
            <textarea rows={3} className="input" value={form.description} onChange={(e) => update("description", e.target.value)} />
          </div>
          <div>
            <label className="label">State</label>
            <input className="input" value={form.state} onChange={(e) => update("state", e.target.value)} />
          </div>
          <div>
            <label className="label">City</label>
            <input className="input" value={form.city} onChange={(e) => update("city", e.target.value)} />
          </div>
          <div>
            <label className="label">GST number</label>
            <input className="input" value={form.gstNumber} onChange={(e) => update("gstNumber", e.target.value)} />
          </div>
          <div>
            <label className="label">Production capacity</label>
            <input className="input" value={form.productionCapacity} onChange={(e) => update("productionCapacity", e.target.value)} placeholder="e.g. 5 tons/month" />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Certifications (comma-separated)</label>
            <input className="input" value={form.certifications} onChange={(e) => update("certifications", e.target.value)} placeholder="FSSAI, USDA Organic" />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Export markets (comma-separated)</label>
            <input className="input" value={form.exportMarkets} onChange={(e) => update("exportMarkets", e.target.value)} placeholder="UAE, UK, Singapore" />
          </div>
          <div className="sm:col-span-2">
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? "Saving..." : "Save profile"}
            </button>
          </div>
        </form>
      </Card>
    </DashboardShell>
  );
}
