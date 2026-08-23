import DashboardShell from "../../components/layout/DashboardShell";
import { manufacturerNav } from "../../components/layout/navConfig";
import { Card } from "../../components/ui/Primitives";
import { useAuth } from "../../context/AuthContext";

export default function AccountSettings() {
  const { user } = useAuth();
  return (
    <DashboardShell navItems={manufacturerNav} sectionLabel="Brand Dashboard" greeting="Account Settings" subtitle="Your login details.">
      <Card className="max-w-lg space-y-4 p-6">
        <div>
          <label className="label">Full name</label>
          <input className="input" value={user?.name} disabled />
        </div>
        <div>
          <label className="label">Email</label>
          <input className="input" value={user?.email} disabled />
        </div>
        <div>
          <label className="label">Phone</label>
          <input className="input" value={user?.phone || ""} disabled />
        </div>
        <p className="text-xs text-forest-400">
          Company details live under <b>My Profile</b>. To change your login email or password, contact support.
        </p>
      </Card>
    </DashboardShell>
  );
}
