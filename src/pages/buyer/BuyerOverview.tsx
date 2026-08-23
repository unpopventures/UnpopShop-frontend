import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Send, FileText, ShoppingCart, Heart, ArrowRight } from "lucide-react";
import DashboardShell from "../../components/layout/DashboardShell";
import { buyerNav } from "../../components/layout/navConfig";
import { StatCard, Card, LoadingBlock, Badge } from "../../components/ui/Primitives";
import PeacockMotif from "../../components/ui/PeacockMotif";
import { api } from "../../api/client";
import { useAuth } from "../../context/AuthContext";

export default function BuyerOverview() {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    api.buyerOverview().then((res) => setData(res.data));
  }, []);

  return (
    <DashboardShell
      navItems={buyerNav}
      sectionLabel="Buyer Dashboard"
      greeting={`Welcome, ${user?.buyerProfile?.companyName || user?.name}! 👋`}
      subtitle="Discover authentic Indian products. Build lasting partnerships."
    >
      {!data ? (
        <LoadingBlock />
      ) : (
        <>
          <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard icon={<Send size={18} />} label="Inquiries Sent" value={data.stats.inquiriesSent} />
            <StatCard icon={<FileText size={18} />} label="Quotes Received" value={data.stats.quotesReceived} />
            <StatCard icon={<ShoppingCart size={18} />} label="Orders Placed" value={data.stats.ordersPlaced} />
            <StatCard icon={<Heart size={18} />} label="Favorite Brands" value={data.stats.favoriteBrands} />
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            <Card className="p-5 lg:col-span-1">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-display text-base text-forest-700">Recommended for You</h3>
                <Link to="/buyer/brands" className="text-xs font-semibold text-gold-600 hover:underline">
                  View all
                </Link>
              </div>
              <div className="space-y-3">
                {data.recommendedBrands.map((b: any) => (
                  <Link key={b.id} to={`/brands/${b.id}`} className="flex items-center gap-3 rounded-lg p-2 hover:bg-cream-100">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-forest-500 text-xs font-semibold text-cream-50">
                      {b.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-forest-700">{b.name}</p>
                      <p className="text-xs text-forest-400">{b.manufacturer?.state || "India"}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </Card>

            <Card className="p-5 lg:col-span-1">
              <h3 className="mb-3 font-display text-base text-forest-700">Popular Categories</h3>
              <div className="space-y-2.5">
                {data.popularCategories.map((c: any) => (
                  <Link
                    key={c.id}
                    to={`/products?category=${c.slug}`}
                    className="flex items-center justify-between rounded-lg p-2 text-sm hover:bg-cream-100"
                  >
                    <span className="text-forest-600">{c.name}</span>
                    <span className="text-xs text-forest-400">{c.productCount}+ brands</span>
                  </Link>
                ))}
              </div>
              <Link to="/products" className="mt-3 flex items-center gap-1 text-xs font-semibold text-gold-600 hover:underline">
                Explore all categories <ArrowRight size={12} />
              </Link>
            </Card>

            <Card className="p-5 lg:col-span-1">
              <h3 className="mb-3 font-display text-base text-forest-700">Recent Inquiries</h3>
              {data.recentInquiries.length === 0 ? (
                <p className="text-sm text-forest-400">No inquiries yet.</p>
              ) : (
                <div className="space-y-3">
                  {data.recentInquiries.map((e: any) => (
                    <div key={e.id} className="flex items-center justify-between">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-forest-700">{e.product.name}</p>
                        <p className="truncate text-xs text-forest-400">{e.product.manufacturer?.companyName}</p>
                      </div>
                      <Badge tone={e.status === "OPEN" ? "warning" : "success"}>{e.status}</Badge>
                    </div>
                  ))}
                </div>
              )}
              <Link to="/buyer/inquiries" className="mt-3 flex items-center gap-1 text-xs font-semibold text-gold-600 hover:underline">
                View all inquiries <ArrowRight size={12} />
              </Link>
            </Card>
          </div>

          <div className="mt-5 flex flex-col items-center gap-6 rounded-2xl bg-forest-500 p-8 text-cream-50 sm:flex-row sm:justify-between">
            <div>
              <h3 className="font-display text-xl">Sourced from India. Trusted by the world.</h3>
              <p className="mt-1 max-w-md text-sm text-cream-100/70">
                Unpop.shop connects you with verified brands, quality products & seamless trade.
              </p>
              <Link to="/buyer/bulk-quote" className="btn-gold mt-4 w-fit">
                Request a bulk quote <ArrowRight size={15} />
              </Link>
            </div>
            <PeacockMotif className="h-32 w-32 shrink-0 opacity-90" />
          </div>
        </>
      )}
    </DashboardShell>
  );
}
