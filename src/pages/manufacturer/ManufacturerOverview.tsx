import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, Users, ShoppingCart, FileText, ArrowRight, AlertCircle } from "lucide-react";
import DashboardShell from "../../components/layout/DashboardShell";
import { manufacturerNav } from "../../components/layout/navConfig";
import { StatCard, Card, LoadingBlock, Badge } from "../../components/ui/Primitives";
import PeacockMotif from "../../components/ui/PeacockMotif";
import { api } from "../../api/client";
import { useAuth } from "../../context/AuthContext";

export default function ManufacturerOverview() {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    api.manufacturerOverview()
      .then((res) => setData(res.data))
      .catch(() => setError(true));
  }, []);

  const status = data?.verificationStatus || "PENDING";
  const statusTone = status === "VERIFIED" ? "success" : status === "REJECTED" ? "danger" : "warning";
  const listingsUsed = Number(data?.listingsUsed || 0);
  const listingLimit = Number(data?.listingLimit || 0);
  const completeness = Math.max(0, Math.min(100, Number(data?.profileCompleteness || 0)));

  return (
    <DashboardShell
      navItems={manufacturerNav}
      sectionLabel="Brand Dashboard"
      greeting={`Vanakkam, ${user?.manufacturerProfile?.companyName || user?.name}! 🙏`}
      subtitle="Manage your company profile, product catalogue and buyer enquiries."
    >
      {error ? (
        <Card className="flex items-start gap-3 p-5">
          <AlertCircle className="mt-0.5 text-red-500" size={20} />
          <div>
            <h3 className="font-semibold text-forest-700">Dashboard data could not be loaded</h3>
            <p className="mt-1 text-sm text-forest-400">Please refresh the page. If the issue continues, contact the Unpop team.</p>
          </div>
        </Card>
      ) : !data ? (
        <LoadingBlock />
      ) : (
        <>
          <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard icon={<Package size={18} />} label="Products listed" value={listingsUsed} />
            <StatCard icon={<Users size={18} />} label="Leads received" value={data.stats.leadsReceived} />
            <StatCard icon={<ShoppingCart size={18} />} label="Orders received" value={data.stats.ordersReceived} />
            <StatCard icon={<FileText size={18} />} label="Submitted quotations" value={data.stats.pendingInquiries} />
          </div>

          <Card className="mb-5 p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="eyebrow mb-1">Manufacturer onboarding</p>
                <h3 className="font-display text-lg text-forest-700">Build a buyer-ready supply profile</h3>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-forest-400">
                  Complete your company information and add structured product listings so prospective buyers can evaluate your supply capabilities.
                </p>
              </div>
              <Badge tone={completeness >= 80 ? "success" : "warning"}>{completeness}% profile complete</Badge>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <Link to="/manufacturer/profile" className="flex items-center justify-between rounded-xl border border-forest-100 p-4 transition hover:bg-cream-50">
                <div>
                  <p className="text-sm font-semibold text-forest-700">1. Company profile</p>
                  <p className="mt-1 text-xs text-forest-400">Company description, location, capacity and business details</p>
                </div>
                <ArrowRight size={16} className="shrink-0 text-gold-600" />
              </Link>
              <Link to="/manufacturer/products" className="flex items-center justify-between rounded-xl border border-forest-100 p-4 transition hover:bg-cream-50">
                <div>
                  <p className="text-sm font-semibold text-forest-700">2. Product catalogue</p>
                  <p className="mt-1 text-xs text-forest-400">Categories, MOQ, packaging, pricing and product specifications</p>
                </div>
                <ArrowRight size={16} className="shrink-0 text-gold-600" />
              </Link>
            </div>
            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between text-xs text-forest-500">
                <span>Product listing usage</span>
                <span>{listingsUsed}{listingLimit > 0 ? ` / ${listingLimit}` : ""}</span>
              </div>
              {listingLimit > 0 && (
                <div className="h-2 overflow-hidden rounded-full bg-cream-200">
                  <div className="h-full rounded-full bg-forest-500" style={{ width: `${Math.min(100, (listingsUsed / listingLimit) * 100)}%` }} />
                </div>
              )}
            </div>
            <div className="mt-4 rounded-lg bg-cream-100 px-4 py-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-forest-600">Verification status</span>
                <Badge tone={statusTone}>{status}</Badge>
              </div>
              <p className="mt-2 text-xs leading-5 text-forest-500">
                {status === "VERIFIED"
                  ? "Your manufacturer profile has been verified by the Unpop team."
                  : status === "REJECTED"
                    ? "Your profile is not verified at this time. Please check your email for the team's feedback or contact Unpop for clarification."
                    : "Your profile is awaiting review. The Unpop team will contact you by email with the documents required. Reply to that email with the requested documents; no upload is needed on this dashboard."}
              </p>
            </div>
          </Card>

          <div className="grid gap-5 lg:grid-cols-2">
            <Card className="p-5">
              <h3 className="mb-3 font-display text-base text-forest-700">Market interest</h3>
              {data.marketInterest.length === 0 ? (
                <p className="text-sm text-forest-400">No matched bulk requests yet. Keep your product catalogue up to date to improve relevance.</p>
              ) : (
                <div className="space-y-2.5">
                  {data.marketInterest.map((m: any) => (
                    <div key={m.country} className="flex items-center justify-between text-sm">
                      <span className="text-forest-600">{m.country}</span>
                      <Badge tone="gold">{m.count} request{m.count > 1 ? "s" : ""}</Badge>
                    </div>
                  ))}
                </div>
              )}
              <Link to="/manufacturer/market-insights" className="mt-3 flex items-center gap-1 text-xs font-semibold text-gold-600 hover:underline">
                View market insights <ArrowRight size={12} />
              </Link>
            </Card>

            <div className="flex flex-col justify-between rounded-2xl bg-forest-500 p-6 text-cream-50">
              <div>
                <h3 className="font-display text-lg">Grow your brand with Unpop</h3>
                <p className="mt-1 text-sm text-cream-100/70">
                  Keep your company information and product catalogue accurate so buyers can assess your offering.
                </p>
              </div>
              <PeacockMotif className="my-4 h-20 w-20 opacity-90" />
              <Link to="/manufacturer/products" className="btn-gold w-fit">
                Manage product catalogue <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          <Card className="mt-5 flex flex-col items-center justify-between gap-4 p-5 sm:flex-row">
            <div className="w-full sm:max-w-md">
              <p className="text-sm font-semibold text-forest-700">Your company profile is {completeness}% complete.</p>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-cream-200">
                <div className="h-full rounded-full bg-forest-500" style={{ width: `${completeness}%` }} />
              </div>
            </div>
            <Link to="/manufacturer/profile" className="btn-outline shrink-0">
              Complete profile <ArrowRight size={15} />
            </Link>
          </Card>
        </>
      )}
    </DashboardShell>
  );
}
