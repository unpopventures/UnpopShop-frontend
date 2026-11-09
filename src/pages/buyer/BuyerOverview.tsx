import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Send, FileText, ShoppingCart, Heart, ArrowRight, Clock, CheckCircle2, Search } from "lucide-react";
import DashboardShell from "../../components/layout/DashboardShell";
import { buyerNav } from "../../components/layout/navConfig";
import { StatCard, Card, LoadingBlock, Badge } from "../../components/ui/Primitives";
import PeacockMotif from "../../components/ui/PeacockMotif";
import { api } from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import { RFQ } from "../../types";

export default function BuyerOverview() {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [rfqs, setRfqs] = useState<RFQ[]>([]);

  useEffect(() => {
    Promise.all([
      api.buyerOverview().then((res) => setData(res.data)),
      api.myRFQs().then((res) => setRfqs(res.data.rfqs)),
    ]).catch((error) => {
      console.error("Unable to load buyer dashboard", error);
    });
  }, []);

  const activeRfqs = rfqs.filter((rfq) => rfq.status === "OPEN" || rfq.status === "QUOTED");
  const quotesToReview = rfqs.filter((rfq) => rfq.finalQuotation?.status === "SENT");
  const recentRfqs = [...rfqs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 4);

  return (
    <DashboardShell
      navItems={buyerNav}
      sectionLabel="Buyer Dashboard"
      greeting={`Welcome, ${user?.buyerProfile?.companyName || user?.name}! 👋`}
      subtitle="Discover Indian suppliers, manage sourcing requests and move procurement forward."
    >
      {!data ? (
        <LoadingBlock />
      ) : (
        <>
          <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard icon={<Send size={18} />} label="Inquiries Sent" value={data.stats.inquiriesSent} />
            <StatCard icon={<FileText size={18} />} label="Quotes Received" value={data.stats.quotesReceived} />
            <StatCard icon={<ShoppingCart size={18} />} label="Orders Placed" value={data.stats.ordersPlaced} />
            <StatCard icon={<Heart size={18} />} label="Saved Products" value={data.stats.favoriteBrands} />
          </div>

          <div className="mb-6 grid gap-4 sm:grid-cols-2">
            <Card className="flex items-center justify-between gap-4 p-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-forest-400">Active sourcing requests</p>
                <p className="mt-1 font-display text-3xl text-forest-700">{activeRfqs.length}</p>
                <p className="mt-1 text-xs text-forest-400">Requests awaiting supplier responses or review</p>
              </div>
              <div className="rounded-xl bg-cream-100 p-3 text-forest-600"><Clock size={22} /></div>
            </Card>
            <Card className="flex items-center justify-between gap-4 p-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-forest-400">Quotes awaiting your decision</p>
                <p className="mt-1 font-display text-3xl text-forest-700">{quotesToReview.length}</p>
                <p className="mt-1 text-xs text-forest-400">Final quotations shared by the Unpop team</p>
              </div>
              <div className="rounded-xl bg-cream-100 p-3 text-forest-600"><CheckCircle2 size={22} /></div>
            </Card>
          </div>

          <div className="mb-6 flex flex-wrap gap-3">
            <Link to="/buyer/brands" className="btn-primary"><Search size={15} /> Find manufacturers</Link>
            <Link to="/buyer/products" className="btn-outline">Browse products</Link>
            <Link to="/buyer/bulk-quote" className="btn-gold"><Send size={15} /> Create an RFQ</Link>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            <Card className="p-5 lg:col-span-1">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-display text-base text-forest-700">Recommended Brands</h3>
                <Link to="/buyer/brands" className="text-xs font-semibold text-gold-600 hover:underline">View all</Link>
              </div>
              <div className="space-y-3">
                {data.recommendedBrands.map((b: any) => (
                  <Link key={b.id} to={`/brands/${b.id}`} className="flex items-center gap-3 rounded-lg p-2 hover:bg-cream-100">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-forest-500 text-xs font-semibold text-cream-50">{b.name.charAt(0)}</div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-forest-700">{b.name}</p>
                      <p className="text-xs text-forest-400">{b.manufacturer?.state || "India"}</p>
                    </div>
                  </Link>
                ))}
                {data.recommendedBrands.length === 0 && <p className="text-sm text-forest-400">New suppliers will appear here as the catalogue grows.</p>}
              </div>
            </Card>

            <Card className="p-5 lg:col-span-1">
              <h3 className="mb-3 font-display text-base text-forest-700">Explore Categories</h3>
              <div className="space-y-2.5">
                {data.popularCategories.map((c: any) => (
                  <Link key={c.id} to={`/products?category=${c.slug}`} className="flex items-center justify-between rounded-lg p-2 text-sm hover:bg-cream-100">
                    <span className="text-forest-600">{c.name}</span>
                    <span className="text-xs text-forest-400">{c.productCount} products</span>
                  </Link>
                ))}
              </div>
              <Link to="/buyer/products" className="mt-3 flex items-center gap-1 text-xs font-semibold text-gold-600 hover:underline">Explore catalogue <ArrowRight size={12} /></Link>
            </Card>

            <Card className="p-5 lg:col-span-1">
              <h3 className="mb-3 font-display text-base text-forest-700">Recent Product Inquiries</h3>
              {data.recentInquiries.length === 0 ? (
                <p className="text-sm text-forest-400">No product enquiries yet.</p>
              ) : (
                <div className="space-y-3">
                  {data.recentInquiries.map((e: any) => (
                    <div key={e.id} className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-forest-700">{e.product.name}</p>
                        <p className="truncate text-xs text-forest-400">{e.product.manufacturer?.companyName}</p>
                      </div>
                      <Badge tone={e.status === "OPEN" ? "warning" : "success"}>{e.status}</Badge>
                    </div>
                  ))}
                </div>
              )}
              <Link to="/buyer/inquiries" className="mt-3 flex items-center gap-1 text-xs font-semibold text-gold-600 hover:underline">View inquiries <ArrowRight size={12} /></Link>
            </Card>
          </div>

          <Card className="mt-5 p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h3 className="font-display text-base text-forest-700">Your RFQ activity</h3>
                <p className="text-xs text-forest-400">Track bulk sourcing requests and respond to final quotations.</p>
              </div>
              <Link to="/buyer/bulk-quote" className="text-xs font-semibold text-gold-600 hover:underline">Manage RFQs</Link>
            </div>
            {recentRfqs.length === 0 ? (
              <div className="rounded-xl bg-cream-100 p-5 text-center">
                <p className="text-sm text-forest-600">No bulk sourcing requests yet.</p>
                <Link to="/buyer/bulk-quote" className="mt-2 inline-flex text-sm font-semibold text-gold-600 hover:underline">Create your first RFQ <ArrowRight size={13} /></Link>
              </div>
            ) : (
              <div className="divide-y divide-cream-200">
                {recentRfqs.map((rfq) => (
                  <div key={rfq.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                    <div>
                      <p className="text-sm font-semibold text-forest-700">{rfq.productName}</p>
                      <p className="text-xs text-forest-400">{rfq.quantity} {rfq.unit} · Destination: {rfq.destinationCountry}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {rfq.finalQuotation?.status === "SENT" && <span className="text-xs font-medium text-gold-700">Decision required</span>}
                      <Badge tone={rfq.status === "ACCEPTED" ? "success" : rfq.status === "CLOSED" ? "neutral" : rfq.status === "FINALIZED" ? "gold" : "warning"}>{rfq.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <div className="mt-5 flex flex-col items-center gap-6 rounded-2xl bg-forest-500 p-8 text-cream-50 sm:flex-row sm:justify-between">
            <div>
              <h3 className="font-display text-xl">Sourced from India. Built for better trade.</h3>
              <p className="mt-1 max-w-md text-sm text-cream-100/70">Tell Unpop what you need. Our team can help match your request with suitable manufacturers.</p>
              <Link to="/buyer/bulk-quote" className="btn-gold mt-4 w-fit">Request a bulk quote <ArrowRight size={15} /></Link>
            </div>
            <PeacockMotif className="h-32 w-32 shrink-0 opacity-90" />
          </div>
        </>
      )}
    </DashboardShell>
  );
}
