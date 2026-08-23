import { useEffect, useState, FormEvent } from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, ShieldCheck, Package, Factory } from "lucide-react";
import { toast } from "react-toastify";
import PublicNavbar from "../../components/layout/PublicNavbar";
import Footer from "../../components/layout/Footer";
import { LoadingBlock, Badge } from "../../components/ui/Primitives";
import { api, apiErrorMessage } from "../../api/client";
import { Product } from "../../types";
import { useAuth } from "../../context/AuthContext";

export default function ProductDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!id) return;
    api
      .product(id)
      .then((res) => setProduct(res.data.product))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleEnquiry(e: FormEvent) {
    e.preventDefault();
    if (!user || user.role !== "BUYER") {
      toast.info("Log in as a buyer to send an enquiry.");
      return;
    }
    setSending(true);
    try {
      await api.createEnquiry({ productId: id, message });
      toast.success("Enquiry sent to the manufacturer.");
      setMessage("");
    } catch (err) {
      toast.error(apiErrorMessage(err));
    } finally {
      setSending(false);
    }
  }

  if (loading) return <LoadingBlock />;
  if (!product) return <EmptyProduct />;

  const certifications = product.certifications?.split(",").map((c) => c.trim()).filter(Boolean) || [];

  return (
    <div className="min-h-screen bg-cream-50">
      <PublicNavbar />
      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="card flex h-64 items-center justify-center bg-cream-200 text-forest-300">
              <span className="font-display text-5xl">{product.name.charAt(0)}</span>
            </div>
          </div>

          <div className="lg:col-span-3">
            <p className="eyebrow mb-2">{product.category?.name}</p>
            <h1 className="mb-2 font-display text-3xl text-forest-700">{product.name}</h1>
            <p className="mb-4 flex items-center gap-1 text-sm text-forest-400">
              <Factory size={14} /> {product.manufacturer?.companyName}
              <span className="mx-1">·</span>
              <MapPin size={14} /> {product.originState || product.originCountry}
              {product.manufacturer?.verificationStatus === "VERIFIED" && (
                <Badge tone="success">
                  <ShieldCheck size={11} /> Verified
                </Badge>
              )}
            </p>

            <p className="mb-6 text-sm text-forest-500">{product.description}</p>

            <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
              <Detail label="Price" value={product.pricePerUnit ? `${product.currency} ${product.pricePerUnit}/${product.moqUnit}` : "On request"} />
              <Detail label="MOQ" value={product.moq ? `${product.moq} ${product.moqUnit}` : "—"} />
              <Detail label="Packaging" value={product.packagingOptions || "—"} />
              <Detail label="Production capacity" value={product.productionCapacity || "—"} />
              <Detail label="Export markets" value={product.exportMarkets || "—"} />
              <Detail label="Availability" value={product.availability ? "In stock" : "Made to order"} />
            </div>

            {certifications.length > 0 && (
              <div className="mb-6 flex flex-wrap gap-2">
                {certifications.map((c) => (
                  <Badge key={c} tone="gold">
                    <Package size={11} /> {c}
                  </Badge>
                ))}
              </div>
            )}

            <div className="card p-5">
              <h3 className="mb-3 font-display text-base text-forest-700">Send an enquiry</h3>
              <form onSubmit={handleEnquiry} className="space-y-3">
                <textarea
                  required
                  rows={3}
                  className="input"
                  placeholder="Ask about pricing, samples, lead time…"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button type="submit" disabled={sending} className="btn-primary">
                  {sending ? "Sending..." : "Send enquiry"}
                </button>
              </form>
              <p className="mt-3 text-xs text-forest-400">
                Need a large quantity instead?{" "}
                <Link to="/bulk-quote" className="font-semibold text-gold-600 hover:underline">
                  Submit a Bulk Quote
                </Link>{" "}
                and Unpop will negotiate on your behalf.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-forest-300">{label}</p>
      <p className="text-sm text-forest-700">{value}</p>
    </div>
  );
}

function EmptyProduct() {
  return (
    <div className="min-h-screen bg-cream-50">
      <PublicNavbar />
      <main className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h1 className="font-display text-2xl text-forest-700">Product not found</h1>
        <Link to="/products" className="mt-4 inline-block text-gold-600 hover:underline">
          ← Back to all products
        </Link>
      </main>
      <Footer />
    </div>
  );
}
