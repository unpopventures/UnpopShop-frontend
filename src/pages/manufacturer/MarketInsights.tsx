import { useEffect, useState, FormEvent } from "react";
import DashboardShell from "../../components/layout/DashboardShell";
import { manufacturerNav } from "../../components/layout/navConfig";
import { Card, LoadingBlock } from "../../components/ui/Primitives";
import RegionBars from "../../components/shared/RegionBars";
import { api } from "../../api/client";
import { DemandPoint } from "../../types";

export default function MarketInsights() {
  const [product, setProduct] = useState("");
  const [country, setCountry] = useState("");
  const [days, setDays] = useState("90");
  const [demand, setDemand] = useState<DemandPoint[]>([]);
  const [loading, setLoading] = useState(true);

  function load(e?: FormEvent) {
    e?.preventDefault();
    setLoading(true);
    api.demandMap({ product: product || undefined, country: country || undefined, days }).then((res) => setDemand(res.data.demand)).finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DashboardShell navItems={manufacturerNav} sectionLabel="Brand Dashboard" greeting="Market Insights" subtitle="Where buyers are demanding your products.">
      <Card className="mb-6 p-5">
        <form onSubmit={load} className="flex flex-col gap-3 sm:flex-row">
          <input value={product} onChange={(e) => setProduct(e.target.value)} placeholder="Filter by product name" className="input flex-1" />
          <input value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Filter by country" className="input flex-1" />
          <select value={days} onChange={(e) => setDays(e.target.value)} className="input sm:w-40">
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="180">Last 6 months</option>
            <option value="365">Last year</option>
          </select>
          <button type="submit" className="btn-primary shrink-0">Apply</button>
        </form>
      </Card>

      <Card className="p-6">
        <h3 className="mb-1 font-display text-base text-forest-700">Demand by destination country</h3>
        <p className="mb-4 text-xs text-forest-400">Aggregated from buyer bulk-quote requests and searches. Buyer identities are never shown.</p>
        {loading ? <LoadingBlock /> : (
          <RegionBars rows={demand.map((d) => ({ label: d.country, value: d.requestCount, level: d.level, meta: `${d.requestCount} request(s)${d.totalQuantity ? `, ${d.totalQuantity} total qty` : ""}` }))} />
        )}
      </Card>
    </DashboardShell>
  );
}
