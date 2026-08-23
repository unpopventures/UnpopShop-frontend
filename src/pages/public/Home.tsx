import { useEffect, useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search, ShieldCheck, Handshake, Ship, Landmark, ArrowRight, Sparkles,
  Boxes, Globe2, TrendingUp, ClipboardList, Users, Factory,
} from "lucide-react";
import PublicNavbar from "../../components/layout/PublicNavbar";
import Footer from "../../components/layout/Footer";
import PeacockMotif from "../../components/ui/PeacockMotif";
import ProductCard from "../../components/shared/ProductCard";
import BrandCard from "../../components/shared/BrandCard";
import { LoadingBlock } from "../../components/ui/Primitives";
import { api, apiErrorMessage } from "../../api/client";
import { Product, Brand, Category } from "../../types";
import { toast } from "react-toastify";

export default function Home() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stats, setStats] = useState({ verifiedManufacturers: 0, activeProducts: 0, rfqsFulfilled: 0 });

  useEffect(() => {
    api
      .homepage()
      .then((res) => {
        setProducts(res.data.featuredProducts);
        setBrands(res.data.featuredBrands);
        setCategories(res.data.categories);
        setStats(res.data.stats);
      })
      .finally(() => setLoading(false));
  }, []);

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    navigate(query ? `/products?q=${encodeURIComponent(query)}` : "/products");
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <PublicNavbar />

      {/* HERO */}
      <section className="relative overflow-hidden bg-hero-pattern">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:py-28">
          <div>
            <p className="eyebrow mb-4">Global B2B sourcing, made in India</p>
            <h1 className="font-display text-4xl leading-[1.1] text-forest-700 sm:text-5xl">
              Source Indian homegrown brands, direct from verified manufacturers.
            </h1>
            <p className="mt-5 max-w-lg text-base text-forest-500">
              Unpop.shop connects international buyers with certified Indian manufacturers for bulk sourcing —
              with every RFQ, quote, and negotiation carefully managed by our team, end to end.
            </p>

            <form onSubmit={handleSearch} className="mt-8 flex max-w-xl overflow-hidden rounded-full bg-white p-1.5 shadow-card">
              <div className="flex flex-1 items-center gap-2 px-3">
                <Search size={18} className="text-forest-300" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search “Honey”, “Moringa Powder”, “Spices”…"
                  className="w-full bg-transparent py-2.5 text-sm text-ink placeholder:text-forest-300 focus:outline-none"
                />
              </div>
              <button type="submit" className="btn-primary shrink-0">
                Find products
              </button>
            </form>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/bulk-quote" className="btn-gold">
                Request a bulk quote <ArrowRight size={15} />
              </Link>
              <Link to="/register/manufacturer" className="btn-outline">
                List your brand
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-8">
              <Stat label="Verified manufacturers" value={stats.verifiedManufacturers} />
              <Stat label="Active product listings" value={stats.activeProducts} />
              <Stat label="Bulk quotes handled" value={stats.rfqsFulfilled} />
            </div>
          </div>

          <div className="relative mx-auto hidden max-w-sm lg:block">
            <div className="absolute -inset-6 rounded-[3rem] bg-forest-500/5" />
            <PeacockMotif className="relative h-[420px] w-full drop-shadow-sm" />
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl px-6 py-14">
        <p className="eyebrow mb-2">Browse by category</p>
        <h2 className="mb-6 font-display text-2xl text-forest-700">Find Indian homegrown products</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {(loading ? Array.from({ length: 8 }) : categories).map((c: any, i) => (
            <Link
              key={c?.id || i}
              to={c ? `/products?category=${c.slug}` : "#"}
              className="card flex flex-col justify-between p-5 transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <Boxes className="mb-6 text-gold-500" size={20} />
              <div>
                <p className="font-display text-sm font-semibold text-forest-700">{c?.name || "…"}</p>
                <p className="text-xs text-forest-400">{c ? `${c._count?.products ?? 0} listings` : ""}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="bg-cream-100 py-14">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="eyebrow mb-2">Featured on Unpop</p>
              <h2 className="font-display text-2xl text-forest-700">Our products</h2>
            </div>
            <Link to="/products" className="hidden text-sm font-semibold text-gold-600 hover:underline sm:block">
              View all products →
            </Link>
          </div>
          {loading ? (
            <LoadingBlock />
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {products.slice(0, 4).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* HOW UNPOP WORKS */}
      <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-16">
        <p className="eyebrow mb-2 text-center">How Unpop works</p>
        <h2 className="mb-10 text-center font-display text-2xl text-forest-700">
          Unpop stays in the middle, so sourcing stays simple
        </h2>
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { icon: <ClipboardList size={20} />, title: "Submit a bulk quote", body: "Tell us the product, quantity, destination and specs." },
            { icon: <Factory size={20} />, title: "We match manufacturers", body: "Relevant verified Indian manufacturers are notified automatically." },
            { icon: <ShieldCheck size={20} />, title: "Unpop reviews & negotiates", body: "Our team compares quotes and finalizes commercial terms." },
            { icon: <Handshake size={20} />, title: "You receive one final quote", body: "A single, negotiated quote — never raw manufacturer bids." },
          ].map((s, i) => (
            <div key={i} className="card p-6">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-forest-500 text-cream-50">
                {s.icon}
              </div>
              <p className="mb-1 font-display text-sm font-semibold text-forest-700">
                {String(i + 1).padStart(2, "0")}. {s.title}
              </p>
              <p className="text-sm text-forest-400">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* DEMAND / SUPPLY INTELLIGENCE */}
      <section className="bg-forest-500 py-16 text-cream-50">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 md:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-gold-400">Market intelligence</p>
            <h2 className="mb-4 font-display text-2xl">See where demand and supply really are</h2>
            <p className="mb-6 text-sm text-cream-100/70">
              Manufacturers get a live Demand Map showing which countries are requesting their products. Buyers get a
              Supply Map showing where Indian manufacturing capacity is concentrated for the products they need.
            </p>
            <div className="flex gap-3">
              <Link to="/register/manufacturer" className="btn-gold">
                <TrendingUp size={15} /> See manufacturer demand
              </Link>
              <Link to="/register/buyer" className="btn-outline border-cream-50/30 text-cream-50 hover:bg-cream-50/10">
                <Globe2 size={15} /> See buyer supply map
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 self-center">
            {[
              { label: "India", value: "High demand" },
              { label: "Japan", value: "High demand" },
              { label: "UAE", value: "Medium demand" },
              { label: "UK", value: "High demand" },
            ].map((d) => (
              <div key={d.label} className="rounded-xl bg-cream-50/10 p-4">
                <p className="text-sm font-semibold">{d.label}</p>
                <p className="text-xs text-gold-400">{d.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED BRANDS */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <p className="eyebrow mb-2">Our trusted brands</p>
        <h2 className="mb-6 font-display text-2xl text-forest-700">Partnering with homegrown, verified manufacturers</h2>
        {loading ? (
          <LoadingBlock />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {brands.slice(0, 8).map((b) => (
              <BrandCard key={b.id} brand={b} />
            ))}
          </div>
        )}
      </section>

      {/* ONBOARDING CTAs */}
      <section className="bg-cream-100 py-16">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 md:grid-cols-2">
          <div className="card flex flex-col justify-between p-8">
            <div>
              <Users className="mb-4 text-gold-500" size={22} />
              <h3 className="mb-2 font-display text-xl text-forest-700">For international buyers</h3>
              <p className="text-sm text-forest-400">
                Browse verified Indian homegrown products, compare manufacturers, and let Unpop manage bulk sourcing
                and negotiation for you.
              </p>
            </div>
            <Link to="/register/buyer" className="btn-primary mt-6 w-fit">
              Start sourcing <ArrowRight size={15} />
            </Link>
          </div>
          <div className="card flex flex-col justify-between p-8">
            <div>
              <Factory className="mb-4 text-gold-500" size={22} />
              <h3 className="mb-2 font-display text-xl text-forest-700">For Indian manufacturers</h3>
              <p className="text-sm text-forest-400">
                List your brand and products, get matched to real international demand, and track it all on your
                Demand Intelligence Map.
              </p>
            </div>
            <Link to="/register/manufacturer" className="btn-gold mt-6 w-fit">
              List your brand <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* GLOBAL MARKET / TRUST STRIP */}
      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {[
            { icon: <ShieldCheck size={20} />, title: "Verified Indian brands", body: "Quality you can trust." },
            { icon: <Handshake size={20} />, title: "Transparent & reliable", body: "Clear communication & support." },
            { icon: <Ship size={20} />, title: "Global shipping support", body: "We help at every step." },
            { icon: <Landmark size={20} />, title: "Cultural authenticity", body: "Heritage brought to your shelves." },
          ].map((t, i) => (
            <div key={i} className="text-center">
              <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-forest-500 text-cream-50">
                {t.icon}
              </div>
              <p className="font-display text-sm font-semibold text-forest-700">{t.title}</p>
              <p className="text-xs text-forest-400">{t.body}</p>
            </div>
          ))}
        </div>
      </section>

      <RegisterProductSection />

      <Footer />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="font-display text-2xl text-forest-700">{value}+</p>
      <p className="text-xs text-forest-400">{label}</p>
    </div>
  );
}

// Preserved from the existing site: a lightweight interest form for small
// manufacturers who aren't ready for full onboarding yet.
function RegisterProductSection() {
  const [form, setForm] = useState({ name: "", phone: "", location: "", business: "", description: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.submitLead(form);
      setSubmitted(true);
      setForm({ name: "", phone: "", location: "", business: "", description: "" });
      toast.success("Thanks! Our team will reach out shortly.");
    } catch (err) {
      toast.error(apiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mx-auto max-w-3xl px-6 pb-20">
      <div className="card p-8">
        <div className="mb-2 flex items-center gap-2">
          <Sparkles size={16} className="text-gold-500" />
          <p className="eyebrow">Not ready for full onboarding?</p>
        </div>
        <h2 className="mb-1 font-display text-xl text-forest-700">Register your product</h2>
        <p className="mb-6 text-sm text-forest-400">
          Tell us about your homegrown product and we'll reach out to help you get listed.
        </p>

        {submitted ? (
          <div className="rounded-xl bg-emerald-50 p-5 text-sm text-emerald-700">
            Thanks — we've received your details and will be in touch soon.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Name</label>
              <input required className="input" value={form.name} onChange={(e) => update("name", e.target.value)} />
            </div>
            <div>
              <label className="label">Phone number</label>
              <input required className="input" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
            </div>
            <div>
              <label className="label">Location</label>
              <input required className="input" value={form.location} onChange={(e) => update("location", e.target.value)} />
            </div>
            <div>
              <label className="label">Business</label>
              <input required className="input" value={form.business} onChange={(e) => update("business", e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Business description</label>
              <textarea
                required
                rows={3}
                className="input"
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
              />
            </div>
            <div className="sm:col-span-2">
              <button type="submit" disabled={submitting} className="btn-primary w-full sm:w-auto">
                {submitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
