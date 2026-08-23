import { useEffect, useState, FormEvent } from "react";
import { Search } from "lucide-react";
import DashboardShell from "../../components/layout/DashboardShell";
import { buyerNav } from "../../components/layout/navConfig";
import { Card, LoadingBlock } from "../../components/ui/Primitives";
import RegionBars from "../../components/shared/RegionBars";
import { api } from "../../api/client";
import { SupplyPoint, Category } from "../../types";

export default function SupplyMap() {
  const [product, setProduct] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [supply, setSupply] = useState<SupplyPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.categories().then((res) => setCategories(res.data.categories));
  }, []);

  function load(e?: FormEvent) {
    e?.preventDefault();
    setLoading(true);
    api.supplyMap({ product: product || undefined, category: category || undefined }).then((res) => setSupply(res.data.supply)).finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DashboardShell
      navItems={buyerNav}
      sectionLabel="Buyer Dashboard"
      greeting="Supply Map"
      subtitle="See where Indian manufacturing capacity is concentrated for a product."
    >
      <Card className="mb-6 p-5">
        <form onSubmit={load} className="flex flex-col gap-3 sm:flex-row">
          <div className="flex flex-1 items-center gap-2 rounded-full border border-forest-200 bg-white px-4">
            <Search size={16} className="text-forest-300" />
            <input value={product} onChange={(e) => setProduct(e.target.value)} placeholder="e.g. Honey" className="w-full bg-transparent py-2.5 text-sm focus:outline-none" />
          </div>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-full border border-forest-200 bg-white px-4 py-2.5 text-sm text-forest-600">
            <option value="">All categories</option>
            {categories.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
          </select>
          <button type="submit" className="btn-primary">Search</button>
        </form>
      </Card>

      <Card className="p-6">
        <h3 className="mb-4 font-display text-base text-forest-700">Manufacturing capacity by region</h3>
        {loading ? <LoadingBlock /> : (
          <RegionBars rows={supply.map((s) => ({ label: s.region, value: s.manufacturerCount, level: s.level, meta: `${s.manufacturerCount} manufacturer(s)` }))} />
        )}
      </Card>
    </DashboardShell>
  );
}
