import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import PublicNavbar from "../../components/layout/PublicNavbar";
import Footer from "../../components/layout/Footer";
import BrandCard from "../../components/shared/BrandCard";
import { LoadingBlock, EmptyState } from "../../components/ui/Primitives";
import { api } from "../../api/client";
import { Brand } from "../../types";

export default function BrandsBrowse() {
  const [q, setQ] = useState("");
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(true);
      api
        .brands(q || undefined)
        .then((res) => setBrands(res.data.brands))
        .finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(timeout);
  }, [q]);

  return (
    <div className="min-h-screen bg-cream-50">
      <PublicNavbar />
      <main className="mx-auto max-w-7xl px-6 py-10">
        <p className="eyebrow mb-2">Verified manufacturers</p>
        <h1 className="mb-6 font-display text-2xl text-forest-700">Discover Indian homegrown brands</h1>

        <div className="mb-8 flex max-w-md items-center gap-2 rounded-full border border-forest-200 bg-white px-4">
          <Search size={16} className="text-forest-300" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search brands…"
            className="w-full bg-transparent py-2.5 text-sm focus:outline-none"
          />
        </div>

        {loading ? (
          <LoadingBlock />
        ) : brands.length === 0 ? (
          <EmptyState title="No brands found" />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {brands.map((b) => (
              <BrandCard key={b.id} brand={b} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
