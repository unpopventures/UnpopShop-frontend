import { useEffect, useState, FormEvent } from "react";
import { toast } from "react-toastify";
import { Plus, Pencil, Trash2, Pause, Play } from "lucide-react";
import DashboardShell from "../../components/layout/DashboardShell";
import { manufacturerNav } from "../../components/layout/navConfig";
import { Card, Badge, LoadingBlock, EmptyState } from "../../components/ui/Primitives";
import { api, apiErrorMessage } from "../../api/client";
import { Product, Brand, Category } from "../../types";

const initialForm = {
  id: "",
  name: "",
  description: "",
  categoryId: "",
  brandId: "",
  moq: "",
  moqUnit: "kg",
  pricePerUnit: "",
  currency: "USD",
  packagingOptions: "",
  originState: "",
  certifications: "",
  productionCapacity: "",
  exportMarkets: "",
};

export default function MyProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [limit, setLimit] = useState({ listingLimit: 0, listingsUsed: 0 });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [newBrandName, setNewBrandName] = useState("");

  function loadAll() {
    setLoading(true);
    Promise.all([api.myProducts(), api.myBrands(), api.categories()]).then(([p, b, c]) => {
      setProducts(p.data.products);
      setLimit({ listingLimit: p.data.listingLimit, listingsUsed: p.data.listingsUsed });
      setBrands(b.data.brands);
      setCategories(c.data.categories);
    }).catch((err) => {
      toast.error(apiErrorMessage(err));
      setProducts([]);
      setBrands([]);
      setCategories([]);
    }).finally(() => setLoading(false));
  }

  useEffect(() => { loadAll(); }, []);

  function update<K extends keyof typeof initialForm>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function startEdit(p: Product) {
    setForm({
      id: p.id,
      name: p.name,
      description: p.description || "",
      categoryId: p.category.id,
      brandId: p.brand?.id || "",
      moq: p.moq?.toString() || "",
      moqUnit: p.moqUnit,
      pricePerUnit: p.pricePerUnit?.toString() || "",
      currency: p.currency,
      packagingOptions: p.packagingOptions || "",
      originState: p.originState || "",
      certifications: p.certifications || "",
      productionCapacity: p.productionCapacity || "",
      exportMarkets: p.exportMarkets || "",
    });
    setShowForm(true);
  }

  async function createBrand() {
    if (!newBrandName.trim()) return;
    try {
      const res = await api.createBrand({ name: newBrandName });
      setBrands((b) => [...b, res.data.brand]);
      setForm((f) => ({ ...f, brandId: res.data.brand.id }));
      setNewBrandName("");
      toast.success("Brand created.");
    } catch (err) {
      toast.error(apiErrorMessage(err));
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload = {
      name: form.name,
      description: form.description,
      categoryId: form.categoryId,
      brandId: form.brandId || undefined,
      moq: form.moq ? Number(form.moq) : undefined,
      moqUnit: form.moqUnit,
      pricePerUnit: form.pricePerUnit ? Number(form.pricePerUnit) : undefined,
      currency: form.currency,
      packagingOptions: form.packagingOptions,
      originState: form.originState,
      certifications: form.certifications,
      productionCapacity: form.productionCapacity,
      exportMarkets: form.exportMarkets,
    };
    try {
      if (form.id) {
        await api.updateProduct(form.id, payload);
        toast.success("Product updated.");
      } else {
        await api.createProduct(payload);
        toast.success("Product listed.");
      }
      setShowForm(false);
      setForm(initialForm);
      loadAll();
    } catch (err) {
      toast.error(apiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function toggleStatus(p: Product) {
    try {
      await api.updateProduct(p.id, { status: p.status === "ACTIVE" ? "PAUSED" : "ACTIVE" });
      loadAll();
    } catch (err) {
      toast.error(apiErrorMessage(err));
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this product listing?")) return;
    try {
      await api.deleteProduct(id);
      toast.success("Product deleted.");
      loadAll();
    } catch (err) {
      toast.error(apiErrorMessage(err));
    }
  }

  const publishedListings = products.filter((product) => product.status !== "DRAFT").length;
  const atLimit = limit.listingLimit > 0 && publishedListings >= limit.listingLimit;

  return (
    <DashboardShell navItems={manufacturerNav} sectionLabel="Brand Dashboard" greeting="My Products" subtitle="Manage your product listings.">
      <Card className="mb-6 flex flex-col items-start justify-between gap-3 p-5 sm:flex-row sm:items-center">
        <div className="w-full sm:max-w-xs">
          <p className="text-sm font-semibold text-forest-700">
            {publishedListings} / {limit.listingLimit} published listings used
          </p>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-cream-200">
            <div className={`h-full rounded-full ${atLimit ? "bg-red-400" : "bg-forest-500"}`} style={{ width: `${Math.min(100, (limit.listingsUsed / Math.max(1, limit.listingLimit)) * 100)}%` }} />
          </div>
          {atLimit && <p className="mt-1 text-xs text-red-500">Limit reached — upgrade your subscription to add more.</p>}
        </div>
        <button
          onClick={() => { setForm(initialForm); setShowForm((s) => !s); }}
          disabled={atLimit && !showForm}
          title={atLimit ? "Your plan listing limit has been reached." : "Add a product listing"}
          className="btn-gold shrink-0 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus size={15} /> {atLimit ? "Listing limit reached" : "Add Product"}
        </button>
      </Card>

      {showForm && (
        <Card className="mb-6 p-6">
          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="label">Product name</label>
              <input required className="input" value={form.name} onChange={(e) => update("name", e.target.value)} />
            </div>
            <div>
              <label className="label">Category</label>
              <select required className="input" value={form.categoryId} onChange={(e) => update("categoryId", e.target.value)}>
                <option value="">Select category</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Brand</label>
              {brands.length > 0 ? (
                <select className="input" value={form.brandId} onChange={(e) => update("brandId", e.target.value)}>
                  <option value="">No specific brand</option>
                  {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              ) : (
                <div className="flex gap-2">
                  <input className="input" placeholder="New brand name" value={newBrandName} onChange={(e) => setNewBrandName(e.target.value)} />
                  <button type="button" onClick={createBrand} className="btn-outline shrink-0 !px-3 text-xs">Create</button>
                </div>
              )}
            </div>
            <div className="sm:col-span-2">
              <label className="label">Description</label>
              <textarea rows={2} className="input" value={form.description} onChange={(e) => update("description", e.target.value)} />
            </div>
            <div>
              <label className="label">MOQ</label>
              <div className="flex gap-2">
                <input type="number" min="0" className="input" value={form.moq} onChange={(e) => update("moq", e.target.value)} />
                <select className="input w-28 shrink-0" value={form.moqUnit} onChange={(e) => update("moqUnit", e.target.value)}>
                  {["kg", "litre", "pieces", "sqm", "ton"].map((u) => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="label">Price per unit</label>
              <div className="flex gap-2">
                <select className="input w-24 shrink-0" value={form.currency} onChange={(e) => update("currency", e.target.value)}>
                  {["USD", "INR", "EUR"].map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <input type="number" min="0" step="0.01" className="input" value={form.pricePerUnit} onChange={(e) => update("pricePerUnit", e.target.value)} />
              </div>
            </div>
            <div>
              <label className="label">Packaging options</label>
              <input className="input" value={form.packagingOptions} onChange={(e) => update("packagingOptions", e.target.value)} placeholder="e.g. 25kg bags, drums" />
            </div>
            <div>
              <label className="label">Origin state</label>
              <input className="input" value={form.originState} onChange={(e) => update("originState", e.target.value)} />
            </div>
            <div>
              <label className="label">Certifications</label>
              <input className="input" value={form.certifications} onChange={(e) => update("certifications", e.target.value)} placeholder="FSSAI, Organic" />
            </div>
            <div>
              <label className="label">Production capacity</label>
              <input className="input" value={form.productionCapacity} onChange={(e) => update("productionCapacity", e.target.value)} />
            </div>
            <div>
              <label className="label">Export markets</label>
              <input className="input" value={form.exportMarkets} onChange={(e) => update("exportMarkets", e.target.value)} />
            </div>
            <div className="flex gap-2 sm:col-span-2">
              <button type="submit" disabled={saving} className="btn-primary">{saving ? "Saving..." : "Save product"}</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">Cancel</button>
            </div>
          </form>
        </Card>
      )}

      {loading ? <LoadingBlock /> : products.length === 0 ? (
        <EmptyState title="No products listed yet" description="Add your first product to start appearing in buyer searches." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <Card key={p.id} className="p-5">
              <div className="mb-2 flex items-start justify-between">
                <p className="font-display text-sm font-semibold text-forest-700">{p.name}</p>
                <Badge tone={p.status === "ACTIVE" ? "success" : p.status === "PAUSED" ? "warning" : "neutral"}>{p.status}</Badge>
              </div>
              <p className="mb-3 text-xs text-forest-400">{p.category.name} {p.brand ? `· ${p.brand.name}` : ""}</p>
              <p className="mb-3 text-sm text-forest-500">
                {p.pricePerUnit ? `${p.currency} ${p.pricePerUnit}/${p.moqUnit}` : "Price on request"}
                {p.moq ? ` · MOQ ${p.moq} ${p.moqUnit}` : ""}
              </p>
              <div className="flex gap-2">
                <button onClick={() => startEdit(p)} className="btn-outline !px-3 text-xs"><Pencil size={13} /></button>
                <button onClick={() => toggleStatus(p)} className="btn-outline !px-3 text-xs">
                  {p.status === "ACTIVE" ? <Pause size={13} /> : <Play size={13} />}
                </button>
                <button onClick={() => remove(p.id)} className="btn-outline !px-3 text-xs text-red-500"><Trash2 size={13} /></button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
