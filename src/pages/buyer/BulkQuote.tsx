import { useEffect, useState, FormEvent } from "react";
import { toast } from "react-toastify";
import { Send, Package, Clock3, MapPin, ClipboardList } from "lucide-react";
import DashboardShell from "../../components/layout/DashboardShell";
import { buyerNav } from "../../components/layout/navConfig";
import { Card, Badge, LoadingBlock, EmptyState, SectionHeading } from "../../components/ui/Primitives";
import { api, apiErrorMessage } from "../../api/client";
import { RFQ, Category } from "../../types";

const statusTone: Record<string, "neutral" | "success" | "warning" | "danger" | "gold"> = {
  OPEN: "neutral", QUOTED: "gold", FINALIZED: "warning", ACCEPTED: "success", CLOSED: "danger",
};

const initialForm = {
  productName: "", categoryId: "", quantity: "", unit: "kg", destinationCountry: "",
  specifications: "", certificationsRequired: "", deliveryTimeline: "", additionalRequirements: "",
};

export default function BulkQuote() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [rfqs, setRfqs] = useState<RFQ[]>([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  function loadRfqs() {
    setLoading(true);
    api.myRFQs().then((res) => setRfqs(res.data.rfqs)).catch((err) => toast.error(apiErrorMessage(err))).finally(() => setLoading(false));
  }

  useEffect(() => {
    api.categories().then((res) => setCategories(res.data.categories)).catch((err) => toast.error(apiErrorMessage(err)));
    loadRfqs();
  }, []);

  function update<K extends keyof typeof initialForm>(key: K, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!Number.isFinite(Number(form.quantity)) || Number(form.quantity) <= 0) {
      toast.error("Enter a quantity greater than zero.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await api.createRFQ({ ...form, quantity: Number(form.quantity) });
      toast.success(`Request submitted. ${res.data.manufacturersNotified} matching manufacturer(s) found.`);
      setForm(initialForm);
      loadRfqs();
    } catch (err) {
      toast.error(apiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  async function respond(id: string, accept: boolean) {
    const confirmed = window.confirm(accept
      ? "Accept this final quotation? The request will be marked accepted."
      : "Decline this final quotation? The request will be closed.");
    if (!confirmed) return;
    try {
      await api.respondToFinalQuotation(id, accept);
      toast.success(accept ? "Quotation accepted." : "Quotation declined and request closed.");
      loadRfqs();
    } catch (err) {
      toast.error(apiErrorMessage(err));
    }
  }

  return (
    <DashboardShell navItems={buyerNav} sectionLabel="Buyer Dashboard" greeting="Bulk sourcing requests" subtitle="Share your requirements with Unpop. Our team reviews the request and coordinates supplier responses.">
      <div className="grid items-start gap-6 xl:grid-cols-5">
        <Card className="p-5 sm:p-6 xl:col-span-2">
          <SectionHeading eyebrow="Sourcing brief" title="Create a new RFQ" />
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label" htmlFor="rfq-product">Product or material *</label>
              <input id="rfq-product" required minLength={2} className="input" value={form.productName} onChange={(e) => update("productName", e.target.value)} placeholder="e.g. Organic moringa powder" />
            </div>
            <div>
              <label className="label" htmlFor="rfq-category">Category</label>
              <select id="rfq-category" className="input" value={form.categoryId} onChange={(e) => update("categoryId", e.target.value)}>
                <option value="">Select if known</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label" htmlFor="rfq-quantity">Required quantity *</label>
                <input id="rfq-quantity" required type="number" min="0.01" step="any" className="input" value={form.quantity} onChange={(e) => update("quantity", e.target.value)} placeholder="e.g. 500" />
              </div>
              <div>
                <label className="label" htmlFor="rfq-unit">Unit *</label>
                <select id="rfq-unit" className="input" value={form.unit} onChange={(e) => update("unit", e.target.value)}>
                  {["kg", "ton", "litre", "pieces", "sets", "sqm", "container"].map((u) => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="label" htmlFor="rfq-destination">Delivery destination country *</label>
              <input id="rfq-destination" required minLength={2} className="input" value={form.destinationCountry} onChange={(e) => update("destinationCountry", e.target.value)} placeholder="e.g. Canada" />
              <p className="mt-1 text-xs text-forest-400">This records your requested destination; it does not itself confirm export or delivery availability.</p>
            </div>
            <div>
              <label className="label" htmlFor="rfq-specs">Product specifications</label>
              <textarea id="rfq-specs" rows={3} className="input" value={form.specifications} onChange={(e) => update("specifications", e.target.value)} placeholder="Grade, ingredients/material, dimensions, quality, intended use…" />
            </div>
            <div>
              <label className="label" htmlFor="rfq-certs">Required certifications or compliance</label>
              <textarea id="rfq-certs" rows={2} className="input" value={form.certificationsRequired} onChange={(e) => update("certificationsRequired", e.target.value)} placeholder="List mandatory certifications or standards, if any" />
            </div>
            <div>
              <label className="label" htmlFor="rfq-timeline">Preferred delivery timeline</label>
              <input id="rfq-timeline" className="input" value={form.deliveryTimeline} onChange={(e) => update("deliveryTimeline", e.target.value)} placeholder="e.g. Within 8 weeks" />
            </div>
            <div>
              <label className="label" htmlFor="rfq-extra">Packaging, labelling and other requirements</label>
              <textarea id="rfq-extra" rows={3} className="input" value={form.additionalRequirements} onChange={(e) => update("additionalRequirements", e.target.value)} placeholder="Pack size, private label, carton details, delivery preferences, target price context…" />
            </div>
            <button type="submit" disabled={submitting} className="btn-gold w-full"><Send size={15} /> {submitting ? "Submitting request…" : "Submit sourcing request"}</button>
            <p className="text-xs text-forest-400">Unpop will review your brief and coordinate matching. Any quotation shown here is the final quotation shared by Unpop, not a live comparison of raw supplier bids.</p>
          </form>
        </Card>

        <section className="xl:col-span-3">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div><p className="eyebrow">Sourcing workspace</p><h2 className="font-display text-xl text-forest-700">Your RFQs and quotations</h2></div>
            <span className="text-xs text-forest-400">{rfqs.length} request(s)</span>
          </div>
          {loading ? <LoadingBlock /> : rfqs.length === 0 ? (
            <EmptyState title="No sourcing requests yet" description="Create your first RFQ using the form. Your requests and final quotations will appear here." />
          ) : (
            <div className="space-y-4">
              {rfqs.map((r) => (
                <Card key={r.id} className="p-4 sm:p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-display text-base font-semibold text-forest-700">{r.productName}</p>
                      <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-forest-400">
                        <span className="inline-flex items-center gap-1"><Package size={12} /> {r.quantity} {r.unit}</span>
                        <span className="inline-flex items-center gap-1"><MapPin size={12} /> {r.destinationCountry}</span>
                        <span className="inline-flex items-center gap-1"><Clock3 size={12} /> {new Date(r.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Badge tone={statusTone[r.status] || "neutral"}>{r.status}</Badge>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-cream-200 pt-3">
                    <span className="text-xs text-forest-500">{r.quotationsReceived || 0} supplier response(s) received</span>
                    <button type="button" onClick={() => setExpanded(expanded === r.id ? null : r.id)} className="text-xs font-semibold text-gold-700 hover:underline">{expanded === r.id ? "Hide request details" : "View request details"}</button>
                  </div>
                  {expanded === r.id && (
                    <div className="mt-3 grid gap-3 rounded-xl bg-cream-100 p-4 text-sm sm:grid-cols-2">
                      <div><p className="text-xs font-semibold text-forest-500">Specifications</p><p className="mt-1 whitespace-pre-wrap text-forest-700">{r.specifications || "Not specified"}</p></div>
                      <div><p className="text-xs font-semibold text-forest-500">Certifications / compliance</p><p className="mt-1 whitespace-pre-wrap text-forest-700">{r.certificationsRequired || "Not specified"}</p></div>
                      <div><p className="text-xs font-semibold text-forest-500">Preferred delivery</p><p className="mt-1 text-forest-700">{r.deliveryTimeline || "Not specified"}</p></div>
                      <div><p className="text-xs font-semibold text-forest-500">Packaging / additional requirements</p><p className="mt-1 whitespace-pre-wrap text-forest-700">{r.additionalRequirements || "Not specified"}</p></div>
                    </div>
                  )}
                  {r.finalQuotation ? (
                    <div className="mt-4 rounded-xl border border-gold-200 bg-cream-100 p-4">
                      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-forest-700"><ClipboardList size={16} /> Final quotation from Unpop</div>
                      <div className="grid grid-cols-2 gap-3 text-sm text-forest-600 sm:grid-cols-4">
                        <div><p className="text-xs text-forest-400">Unit price</p><b>{r.finalQuotation.currency} {r.finalQuotation.finalPricePerUnit.toLocaleString()}</b></div>
                        <div><p className="text-xs text-forest-400">Total</p><b>{r.finalQuotation.currency} {r.finalQuotation.finalTotalPrice.toLocaleString()}</b></div>
                        <div><p className="text-xs text-forest-400">Delivery</p><b>{r.finalQuotation.deliveryTimeline || "To be confirmed"}</b></div>
                        <div><p className="text-xs text-forest-400">Quote status</p><b>{r.finalQuotation.status}</b></div>
                      </div>
                      {r.finalQuotation.supplierSummary && <p className="mt-3 text-sm text-forest-600">{r.finalQuotation.supplierSummary}</p>}
                      {r.finalQuotation.terms && <p className="mt-2 whitespace-pre-wrap text-xs text-forest-500">{r.finalQuotation.terms}</p>}
                      {r.finalQuotation.status === "SENT" && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          <button type="button" onClick={() => respond(r.id, true)} className="btn-primary !px-4 !py-2 text-xs">Accept quotation</button>
                          <button type="button" onClick={() => respond(r.id, false)} className="btn-outline !px-4 !py-2 text-xs">Decline quotation</button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="mt-3 text-xs text-forest-400">{r.quotationsReceived ? "Supplier responses have been received. Unpop is reviewing the request and commercial terms." : "Awaiting supplier responses and Unpop review."}</p>
                  )}
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </DashboardShell>
  );
}
