import { useEffect, useState } from "react";
import DashboardShell from "../../components/layout/DashboardShell";
import { buyerNav } from "../../components/layout/navConfig";
import ProductCard from "../../components/shared/ProductCard";
import { LoadingBlock, EmptyState } from "../../components/ui/Primitives";
import { api } from "../../api/client";

export default function Favorites() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    api.favorites().then((res) => setFavorites(res.data.favorites)).finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  async function remove(productId: string) {
    await api.removeFavorite(productId);
    load();
  }

  return (
    <DashboardShell navItems={buyerNav} sectionLabel="Buyer Dashboard" greeting="Favorites" subtitle="Products and brands you've saved.">
      {loading ? <LoadingBlock /> : favorites.length === 0 ? (
        <EmptyState title="No favorites yet" description="Tap the heart icon on any product to save it here." />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {favorites.map((f) => (
            <ProductCard key={f.id} product={f.product} isFavorite onToggleFavorite={() => remove(f.productId)} />
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
