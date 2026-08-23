import { useEffect, useState, FormEvent } from "react";
import { toast } from "react-toastify";
import { Send, Package } from "lucide-react";
import DashboardShell from "../../components/layout/DashboardShell";
import { buyerNav } from "../../components/layout/navConfig";
import { Card, Badge, LoadingBlock, EmptyState, SectionHeading } from "../../components/ui/Primitives";
import { api, apiErrorMessage } from "../../api/client";
import { RFQ, Category } from "../../types";

const statusTone: Record<string, "neutral" | "success" | "warning" | "danger" | "gold"> = {
  OPEN: "neutral",
  QUOTED: "gold",
  FINALIZED: "warning",
  ACCEPTED: "success",
  CLOSED: "danger",
};

const initialForm = {
  productName: "",
  categoryId: "",
  quantity: "",
  unit: "ton",
  destinationCountry: "",
  specifications: "",
  certificationsRequired: "",
  deliveryTimeline: "",
  additionalRequirements: "",
};

export default function BulkQuote() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [rfqs, setRfqs] = useState<RFQ[]>([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  function loadRfqs() {
    setLoading(true);
    api.myRFQs().then((res) => setRfqs(res.data.rfqs)).finally(() => setLoading(false));
  }

  useEffect(() => {
    api.categories().then((res) => setCategories(res.data.categories));
    loadRfqs();
  }, []);

  function update<K extends keyof typeof initialForm>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.createRFQ({ ...form, quantity: Number(form.quantity) });
      toast.success(`Bulk quote submitted — notified ${res.data.manufacturersNotified} manufacturer(s).`);
      setForm(initialForm);
      loadRfqs();
    } catch (err) {
      toast.error(apiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  async function respond(id: string, accept: boolean) {
    try {
      await api.respondToFinalQuotation(id, accept);
      toast.success(accept ? "Quote accepted!" : "Quote declined.");
      loadRfqs();
    } catch (err) {
      toast.error(apiErrorMessage(err));
    }
  }

  return (
    <DashboardShell
      navItems={buyerNav}
      sectionLabel="Buyer Dashboard"
      greeting="Bulk Quote / RFQ"
      subtitle="Can't find what you need? Tell us and we'll source it for you."
    >
      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="p-6 lg:col-span-2">
          <SectionHeading eyebrow="New request" title="Request for Quote" />
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Product</label>
              <input required className="input" value={form.productName} onChange={(e) => update("productName", e.target.value)} placeholder="e.g. Moringa Powder" />
            </div>
            <div>
              <label className="label">Category (optional)</label>
              <select className="input" value={form.categoryId} onChange={(e) => update("categoryId", e.target.value)}>
                <option value="">Auto-detect from product name</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Quantity</label>
                <input required type="number" min="0" step="0.01" className="input" value={form.quantity} onChange={(e) => update("quantity", e.target.value)} />
              </div>
              <div>
                <label className="label">Unit</label>
                <select className="input" value={form.unit} onChange={(e) => update("unit", e.target.value)}>
                  {["ton", "kg", "litre", "pieces", "sqm", "container"].map((u) => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="label">Destination country</label>
              <input required className="input" value={form.destinationCountry} onChange={(e) => update("destinationCountry", e.target.value)} placeholder="e.g. Japan" />
            </div>
            <div>
              <label className="label">Required specifications / certifications</label>
              <textarea rows={2} className="input" value={form.specifications} onChange={(e) => update("specifications", e.target.value)} />
            </div>
            <div>
              <label className="label">Expected delivery timeline</label>
              <input className="input" value={form.deliveryTimeline} onChange={(e) => update("deliveryTimeline", e.target.value)} placeholder="e.g. 6 weeks" />
            </div>
            <div>
              <label className="label">Additional requirements</label>
              <textarea rows={2} className="input" value={form.additionalRequirements} onChange={(e) => update("additionalRequirements", e.target.value)} />
            </div>
            <button type="submit" disabled={submitting} className="btn-gold w-full">
              <Send size={15} /> {submitting ? "Submitting..." : "Submit Bulk Quote Request"}
            </button>
            <p className="text-xs text-forest-400">
              Your request goes to our admin team, who match it against verified manufacturers and negotiate the best terms on your behalf.
            </p>
          </form>
        </Card>

        <div className="lg:col-span-3">
          <SectionHeading title="Your requests" />
          {loading ? (
            <LoadingBlock />
          ) : rfqs.length === 0 ? (
            <EmptyState title="No bulk quotes yet" description="Submit your first request using the form." />
          ) : (
            <div className="space-y-4">
              {rfqs.map((r) => (
                <Card key={r.id} className="p-5">
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <div>
                      <p className="font-display text-base text-forest-700">{r.productName}</p>
                      <p className="text-xs text-forest-400">
                        {r.quantity} {r.unit} → {r.destinationCountry}
                      </p>
                    </div>
                    <Badge tone={statusTone[r.status]}>{r.status}</Badge>
                  </div>

                  {r.finalQuotation ? (
                    <div className="mt-3 rounded-xl bg-cream-100 p-4">
                      <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-forest-700">
                        <Package size={15} /> Final quotation from Unpop
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm text-forest-600 sm:grid-cols-4">
                        <span>Price/unit: <b>{r.finalQuotation.currency} {r.finalQuotation.finalPricePerUnit}</b></span>
                        <span>Total: <b>{r.finalQuotation.currency} {r.finalQuotation.finalTotalPrice.toLocaleString()}</b></span>
                        <span>Delivery: <b>{r.finalQuotation.deliveryTimeline || "—"}</b></span>
                        <span>Status: <b>{r.finalQuotation.status}</b></span>
                      </div>
                      {r.finalQuotation.terms && <p className="mt-2 text-xs text-forest-400">{r.finalQuotation.terms}</p>}
                      {r.finalQuotation.status === "SENT" && (
                        <div className="mt-3 flex gap-2">
                          <button onClick={() => respond(r.id, true)} className="btn-primary !py-1.5 !px-4 text-xs">Accept quote</button>
                          <button onClick={() => respond(r.id, false)} className="btn-outline !py-1.5 !px-4 text-xs">Decline</button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="mt-2 text-xs text-forest-400">
                      {r.quotationsReceived ? `${r.quotationsReceived} manufacturer(s) have responded — Unpop is reviewing terms.` : "Waiting for manufacturer responses."}
                    </p>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
