import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, SlidersHorizontal } from "lucide-react";
import PublicNavbar from "../../components/layout/PublicNavbar";
import Footer from "../../components/layout/Footer";
import ProductCard from "../../components/shared/ProductCard";
import { LoadingBlock, EmptyState } from "../../components/ui/Primitives";
import { api } from "../../api/client";
import { Product, Category } from "../../types";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

export default function ProductsBrowse() {
  const [params, setParams] = useSearchParams();
  const { user } = useAuth();
  const [q, setQ] = useState(params.get("q") || "");
  const [category, setCategory] = useState(params.get("category") || "");
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.categories().then((res) => setCategories(res.data.categories));
  }, []);

  useEffect(() => {
    if (user?.role === "BUYER") {
      api.favorites().then((res) => setFavoriteIds(new Set(res.data.favorites.map((f: any) => f.productId))));
    }
  }, [user]);

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
    if (!user || user.role !== "BUYER") {
      toast.info("Log in as a buyer to save favorites.");
      return;
    }
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
    <div className="min-h-screen bg-cream-50">
      <PublicNavbar />
      <main className="mx-auto max-w-7xl px-6 py-10">
        <p className="eyebrow mb-2">Product catalog</p>
        <h1 className="mb-6 font-display text-2xl text-forest-700">Discover Indian homegrown products</h1>

        <form onSubmit={applyFilters} className="mb-8 flex flex-col gap-3 sm:flex-row">
          <div className="flex flex-1 items-center gap-2 rounded-full border border-forest-200 bg-white px-4">
            <Search size={16} className="text-forest-300" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search products, brands, manufacturers…"
              className="w-full bg-transparent py-2.5 text-sm focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2 rounded-full border border-forest-200 bg-white px-4">
            <SlidersHorizontal size={15} className="text-forest-300" />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-transparent py-2.5 text-sm text-forest-600 focus:outline-none"
            >
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn-primary">
            Apply
          </button>
        </form>

        {loading ? (
          <LoadingBlock />
        ) : products.length === 0 ? (
          <EmptyState
            title="No products matched your search"
            description="Try a broader search term, or submit a Bulk Quote and we'll find suppliers for you."
            action={
              <Link to="/bulk-quote" className="btn-gold">
                Request a bulk quote
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} isFavorite={favoriteIds.has(p.id)} onToggleFavorite={() => toggleFavorite(p.id)} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
