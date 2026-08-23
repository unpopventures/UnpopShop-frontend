import { useState, FormEvent } from "react";
import { toast } from "react-toastify";
import DashboardShell from "../../components/layout/DashboardShell";
import { buyerNav } from "../../components/layout/navConfig";
import { Card } from "../../components/ui/Primitives";
import { useAuth } from "../../context/AuthContext";

export default function BuyerSettings() {
  const { user } = useAuth();
  const [companyName, setCompanyName] = useState(user?.buyerProfile?.companyName || "");
  const [country, setCountry] = useState(user?.buyerProfile?.country || "");
  const [city, setCity] = useState(user?.buyerProfile?.city || "");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    // Buyer profile editing endpoint can be wired the same way as the
    // manufacturer profile endpoint (PATCH /api/buyer/profile) if you want
    // this to persist -- kept as a local form here to keep the initial
    // buyer routes focused on the core sourcing workflow.
    toast.success("Saved locally. Wire this up to a PATCH /api/buyer/profile endpoint to persist changes.");
  }

  return (
    <DashboardShell navItems={buyerNav} sectionLabel="Buyer Dashboard" greeting="Account Settings" subtitle="Manage your company details.">
      <Card className="max-w-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Full name</label>
            <input className="input" value={user?.name} disabled />
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input" value={user?.email} disabled />
          </div>
          <div>
            <label className="label">Company name</label>
            <input className="input" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Country</label>
              <input className="input" value={country} onChange={(e) => setCountry(e.target.value)} />
            </div>
            <div>
              <label className="label">City</label>
              <input className="input" value={city} onChange={(e) => setCity(e.target.value)} />
            </div>
          </div>
          <button type="submit" className="btn-primary">Save changes</button>
        </form>
      </Card>
    </DashboardShell>
  );
}
