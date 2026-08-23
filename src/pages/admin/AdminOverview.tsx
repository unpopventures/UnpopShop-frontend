import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Users, Factory, Package, Boxes, FileText, ShieldCheck, ArrowRight, CreditCard } from "lucide-react";
import DashboardShell from "../../components/layout/DashboardShell";
import { adminNav } from "../../components/layout/navConfig";
import { StatCard, Card, LoadingBlock } from "../../components/ui/Primitives";
import PeacockMotif from "../../components/ui/PeacockMotif";
import { api } from "../../api/client";
import { useAuth } from "../../context/AuthContext";

export default function AdminOverview() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    api.adminOverview().then((res) => setStats(res.data.stats));
  }, []);

  return (
    <DashboardShell
      navItems={adminNav}
      sectionLabel="Admin Dashboard"
      greeting={`Welcome, ${user?.name}`}
      subtitle="Full oversight of buyers, manufacturers, and the RFQ pipeline."
    >
      {!stats ? (
        <LoadingBlock />
      ) : (
        <>
          <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard icon={<Users size={18} />} label="Buyers" value={stats.buyerCount} />
            <StatCard icon={<Factory size={18} />} label="Manufacturers" value={stats.manufacturerCount} />
            <StatCard icon={<ShieldCheck size={18} />} label="Verified" value={stats.verifiedManufacturers} />
            <StatCard icon={<Package size={18} />} label="Active Products" value={stats.productCount} />
          </div>
          <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard icon={<Boxes size={18} />} label="Brands" value={stats.brandCount} />
            <StatCard icon={<FileText size={18} />} label="Open RFQs" value={stats.openRfqs} />
            <StatCard icon={<FileText size={18} />} label="Quoted RFQs" value={stats.quotedRfqs} />
            <StatCard icon={<CreditCard size={18} />} label="Active Subscriptions" value={stats.activeSubscriptions} />
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            <Card className="p-6">
              <h3 className="mb-2 font-display text-base text-forest-700">RFQ pipeline needs attention</h3>
              <p className="mb-4 text-sm text-forest-400">
                {stats.pendingQuotations} manufacturer quotation(s) awaiting your review, {stats.pendingVerification} manufacturer(s) awaiting verification.
              </p>
              <div className="flex flex-wrap gap-2">
                <Link to="/admin/rfqs" className="btn-primary">
                  Review RFQs <ArrowRight size={15} />
                </Link>
                <Link to="/admin/manufacturers" className="btn-outline">
                  Review manufacturers
                </Link>
              </div>
            </Card>
            <div className="flex flex-col justify-between rounded-2xl bg-forest-500 p-6 text-cream-50 lg:col-span-2">
              <div>
                <h3 className="font-display text-lg">Unpop is the trusted intermediary</h3>
                <p className="mt-1 max-w-md text-sm text-cream-100/70">
                  Every RFQ is filtered through your review — buyers only ever see the final, negotiated quote.
                </p>
              </div>
              <PeacockMotif className="mt-4 h-24 w-24 self-end opacity-90" />
            </div>
          </div>
        </>
      )}
    </DashboardShell>
  );
}
