import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import DashboardShell from "../../components/layout/DashboardShell";
import { buyerNav } from "../../components/layout/navConfig";
import BrandCard from "../../components/shared/BrandCard";
import { LoadingBlock, EmptyState } from "../../components/ui/Primitives";
import { api } from "../../api/client";
import { Brand } from "../../types";

export default function DiscoverBrands() {
  const [q, setQ] = useState("");
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setLoading(true);
      api.brands(q || undefined).then((res) => setBrands(res.data.brands)).finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(t);
  }, [q]);

  return (
    <DashboardShell navItems={buyerNav} sectionLabel="Buyer Dashboard" greeting="Discover Brands" subtitle="Find verified Indian homegrown manufacturers.">
      <div className="mb-6 flex max-w-md items-center gap-2 rounded-full border border-forest-200 bg-white px-4">
        <Search size={16} className="text-forest-300" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search brands…" className="w-full bg-transparent py-2.5 text-sm focus:outline-none" />
      </div>
      {loading ? <LoadingBlock /> : brands.length === 0 ? <EmptyState title="No brands found" /> : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {brands.map((b) => <BrandCard key={b.id} brand={b} />)}
        </div>
      )}
    </DashboardShell>
  );
}
