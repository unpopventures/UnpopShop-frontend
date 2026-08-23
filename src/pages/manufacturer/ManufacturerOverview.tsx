import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, ShoppingBag, Users, ShoppingCart, MessageCircle, ArrowRight } from "lucide-react";
import DashboardShell from "../../components/layout/DashboardShell";
import { manufacturerNav } from "../../components/layout/navConfig";
import { StatCard, Card, LoadingBlock, Badge } from "../../components/ui/Primitives";
import PeacockMotif from "../../components/ui/PeacockMotif";
import { api } from "../../api/client";
import { useAuth } from "../../context/AuthContext";

export default function ManufacturerOverview() {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    api.manufacturerOverview().then((res) => setData(res.data));
  }, []);

  return (
    <DashboardShell
      navItems={manufacturerNav}
      sectionLabel="Brand Dashboard"
      greeting={`Vanakkam, ${user?.manufacturerProfile?.companyName || user?.name}! 🙏`}
      subtitle="Manage your brand, products & global growth in one place."
    >
      {!data ? (
        <LoadingBlock />
      ) : (
        <>
          <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-5">
            <StatCard icon={<Eye size={18} />} label="Profile Views" value={data.stats.profileViews} />
            <StatCard icon={<ShoppingBag size={18} />} label="Product Views" value={data.stats.productViews} />
            <StatCard icon={<Users size={18} />} label="Leads Received" value={data.stats.leadsReceived} />
            <StatCard icon={<ShoppingCart size={18} />} label="Orders Received" value={data.stats.ordersReceived} />
            <StatCard icon={<MessageCircle size={18} />} label="Pending Inquiries" value={data.stats.pendingInquiries} />
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            <Card className="p-5">
              <h3 className="mb-3 font-display text-base text-forest-700">Top Performing Products</h3>
              {data.topProducts.length === 0 ? (
                <p className="text-sm text-forest-400">Add products to see performance here.</p>
              ) : (
                <div className="space-y-3">
                  {data.topProducts.map((p: any) => (
                    <div key={p.id}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="font-medium text-forest-700">{p.name}</span>
                        <span className="text-xs text-forest-400">{p.views} views</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-cream-200">
                        <div className="h-full rounded-full bg-peacock" style={{ width: `${Math.min(100, p.views / 5)}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <Link to="/manufacturer/products" className="mt-3 flex items-center gap-1 text-xs font-semibold text-gold-600 hover:underline">
                View all products <ArrowRight size={12} />
              </Link>
            </Card>

            <Card className="p-5">
              <h3 className="mb-3 font-display text-base text-forest-700">Market Interest</h3>
              {data.marketInterest.length === 0 ? (
                <p className="text-sm text-forest-400">No RFQ matches yet.</p>
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
                View full report <ArrowRight size={12} />
              </Link>
            </Card>

            <div className="flex flex-col justify-between rounded-2xl bg-forest-500 p-6 text-cream-50">
              <div>
                <h3 className="font-display text-lg">Grow Your Brand Globally</h3>
                <p className="mt-1 text-sm text-cream-100/70">
                  Access market insights, connect with verified buyers & expand your reach.
                </p>
              </div>
              <PeacockMotif className="my-4 h-20 w-20 opacity-90" />
              <Link to="/manufacturer/market-insights" className="btn-gold w-fit">
                Explore Opportunities <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          <Card className="mt-5 flex flex-col items-center justify-between gap-4 p-5 sm:flex-row">
            <div className="w-full sm:max-w-md">
              <p className="text-sm font-semibold text-forest-700">
                🎉 Your profile is {data.profileCompleteness}% complete.
              </p>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-cream-200">
                <div className="h-full rounded-full bg-forest-500" style={{ width: `${data.profileCompleteness}%` }} />
              </div>
            </div>
            <Link to="/manufacturer/profile" className="btn-outline shrink-0">
              Complete Profile <ArrowRight size={15} />
            </Link>
          </Card>

          {data.verificationStatus !== "VERIFIED" && (
            <Card className="mt-5 p-5">
              <Badge tone={data.verificationStatus === "REJECTED" ? "danger" : "warning"}>
                Verification: {data.verificationStatus}
              </Badge>
              <p className="mt-2 text-sm text-forest-400">
                Once our team verifies your company, buyers will see your Verified badge and you'll be matched against relevant bulk quote requests.
              </p>
            </Card>
          )}
        </>
      )}
    </DashboardShell>
  );
}
