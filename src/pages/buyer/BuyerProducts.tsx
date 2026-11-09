import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, SlidersHorizontal } from "lucide-react";
import DashboardShell from "../../components/layout/DashboardShell";
import { buyerNav } from "../../components/layout/navConfig";
import ProductCard from "../../components/shared/ProductCard";
import { LoadingBlock, EmptyState } from "../../components/ui/Primitives";
import { api } from "../../api/client";
import { Product, Category } from "../../types";

export default function BuyerProducts() {
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState(params.get("q") || "");
  const [category, setCategory] = useState(params.get("category") || "");
  const [origin, setOrigin] = useState(params.get("country") || "");
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.categories().then((res) => setCategories(res.data.categories));
    api.favorites().then((res) => setFavoriteIds(new Set(res.data.favorites.map((f: any) => f.productId))));
  }, []);

  useEffect(() => {
    setQ(params.get("q") || "");
    setCategory(params.get("category") || "");
    setOrigin(params.get("country") || "");
    setLoading(true);
    api.searchProducts({
      q: params.get("q") || undefined,
      category: params.get("category") || undefined,
      country: params.get("country") || undefined,
    }).then((res) => setProducts(res.data.items)).finally(() => setLoading(false));
  }, [params]);

  function applyFilters(e?: React.FormEvent) {
    e?.preventDefault();
    const next = new URLSearchParams();
    if (q.trim()) next.set("q", q.trim());
    if (category) next.set("category", category);
    if (origin.trim()) next.set("country", origin.trim());
    setParams(next);
  }

  function clearFilters() {
    setQ("");
    setCategory("");
    setOrigin("");
    setParams(new URLSearchParams());
  }

  async function toggleFavorite(productId: string) {
    if (favoriteIds.has(productId)) {
      await api.removeFavorite(productId);
      setFavoriteIds((prev) => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
    } else {
      await api.addFavorite(productId);
      setFavoriteIds((prev) => new Set(prev).add(productId));
    }
  }

  const hasFilters = Boolean(params.get("q") || params.get("category") || params.get("country"));

  return (
    <DashboardShell navItems={buyerNav} sectionLabel="Buyer Dashboard" greeting="Product catalogue" subtitle="Discover wholesale products and compare supplier details before sending an enquiry.">
      <form onSubmit={applyFilters} className="mb-6 rounded-2xl border border-forest-100 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-forest-700"><SlidersHorizontal size={16} /> Search and filter catalogue</div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div className="flex items-center gap-2 rounded-xl border border-forest-200 px-3">
            <Search size={16} className="shrink-0 text-forest-300" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Product, brand or supplier" className="w-full bg-transparent py-2.5 text-sm focus:outline-none" />
          </div>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-xl border border-forest-200 bg-white px-3 py-2.5 text-sm text-forest-600">
            <option value="">All categories</option>
            {categories.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
          </select>
          <input value={origin} onChange={(e) => setOrigin(e.target.value)} placeholder="Origin state / region" className="rounded-xl border border-forest-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-200" />
          <div className="flex gap-2">
            <button type="submit" className="btn-primary flex-1">Apply filters</button>
            {hasFilters && <button type="button" onClick={clearFilters} className="btn-outline">Clear</button>}
          </div>
        </div>
        <p className="mt-2 text-xs text-forest-400">Origin search matches the product's listed origin state. Other supplier and product specifications are shown on each listing where provided.</p>
      </form>

      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-forest-500">{loading ? "Searching catalogue…" : `${products.length} product listing(s) shown`}</p>
        <Link to="/buyer/bulk-quote" className="text-sm font-semibold text-gold-700 hover:underline">Can't find a product? Create an RFQ</Link>
      </div>

      {loading ? <LoadingBlock /> : products.length === 0 ? (
        <EmptyState title="No products matched your search" description="Try a broader search or send Unpop a bulk sourcing request." action={<Link to="/buyer/bulk-quote" className="btn-gold">Request a bulk quote</Link>} />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((p) => <ProductCard key={p.id} product={p} isFavorite={favoriteIds.has(p.id)} onToggleFavorite={() => toggleFavorite(p.id)} />)}
        </div>
      )}
    </DashboardShell>
  );
}
