import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, ShieldCheck } from "lucide-react";
import PublicNavbar from "../../components/layout/PublicNavbar";
import Footer from "../../components/layout/Footer";
import ProductCard from "../../components/shared/ProductCard";
import { LoadingBlock, Badge } from "../../components/ui/Primitives";
import { api } from "../../api/client";

export default function BrandDetail() {
  const { id } = useParams();
  const [brand, setBrand] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    api
      .brand(id)
      .then((res) => setBrand(res.data.brand))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingBlock />;
  if (!brand)
    return (
      <div className="min-h-screen bg-cream-50">
        <PublicNavbar />
        <main className="mx-auto max-w-3xl px-6 py-20 text-center">
          <h1 className="font-display text-2xl text-forest-700">Brand not found</h1>
          <Link to="/brands" className="mt-4 inline-block text-gold-600 hover:underline">
            ← Back to all brands
          </Link>
        </main>
        <Footer />
      </div>
    );

  return (
    <div className="min-h-screen bg-cream-50">
      <PublicNavbar />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="card mb-8 p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-forest-500 font-display text-2xl text-cream-50">
              {brand.name.charAt(0)}
            </div>
            <div>
              <h1 className="font-display text-2xl text-forest-700">{brand.name}</h1>
              <p className="flex items-center gap-1 text-sm text-forest-400">
                <MapPin size={13} /> {brand.state || brand.manufacturer?.state} · {brand.manufacturer?.country}
                {brand.manufacturer?.verificationStatus === "VERIFIED" && (
                  <Badge tone="success">
                    <ShieldCheck size={11} /> Verified manufacturer
                  </Badge>
                )}
              </p>
              {brand.description && <p className="mt-3 max-w-2xl text-sm text-forest-500">{brand.description}</p>}
            </div>
          </div>
        </div>

        <h2 className="mb-4 font-display text-lg text-forest-700">Products from {brand.name}</h2>
        {brand.products?.length ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {brand.products.map((p: any) => (
              <ProductCard key={p.id} product={{ ...p, brand, manufacturer: brand.manufacturer }} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-forest-400">No active listings yet.</p>
        )}
      </main>
      <Footer />
    </div>
  );
}
