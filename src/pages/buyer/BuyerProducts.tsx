import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search } from "lucide-react";
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
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.categories().then((res) => setCategories(res.data.categories));
    api.favorites().then((res) => setFavoriteIds(new Set(res.data.favorites.map((f: any) => f.productId))));
  }, []);

  useEffect(() => {
    setLoading(true);
    api
      .searchProducts({ q: params.get("q") || undefined, category: params.get("category") || undefined })
      .then((res) => setProducts(res.data.items))
      .finally(() => setLoading(false));
  }, [params]);

  function applyFilters(e?: React.FormEvent) {
    e?.preventDefault();
    const next = new URLSearchParams();
    if (q) next.set("q", q);
    if (category) next.set("category", category);
    setParams(next);
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

  return (
    <DashboardShell navItems={buyerNav} sectionLabel="Buyer Dashboard" greeting="Products" subtitle="Search and browse Indian homegrown products.">
      <form onSubmit={applyFilters} className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="flex flex-1 items-center gap-2 rounded-full border border-forest-200 bg-white px-4">
          <Search size={16} className="text-forest-300" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products…" className="w-full bg-transparent py-2.5 text-sm focus:outline-none" />
        </div>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-full border border-forest-200 bg-white px-4 py-2.5 text-sm text-forest-600">
          <option value="">All categories</option>
          {categories.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
        </select>
        <button type="submit" className="btn-primary">Apply</button>
      </form>

      {loading ? <LoadingBlock /> : products.length === 0 ? (
        <EmptyState title="No products matched your search" description="Can't find it? Submit a Bulk Quote instead." action={<Link to="/buyer/bulk-quote" className="btn-gold">Request a bulk quote</Link>} />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} isFavorite={favoriteIds.has(p.id)} onToggleFavorite={() => toggleFavorite(p.id)} />
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
