import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Send } from "lucide-react";
import DashboardShell from "../../components/layout/DashboardShell";
import { manufacturerNav } from "../../components/layout/navConfig";
import { Card, Badge, LoadingBlock, EmptyState } from "../../components/ui/Primitives";
import { api, apiErrorMessage } from "../../api/client";

export default function OrdersLeads() {
  const [rfqs, setRfqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState<string | null>(null);
  const [form, setForm] = useState({ pricePerUnit: "", currency: "USD", leadTimeDays: "", termsNotes: "", certifications: "" });
  const [submitting, setSubmitting] = useState(false);

  function load() {
    setLoading(true);
    api.matchedRFQs().then((res) => setRfqs(res.data.rfqs)).finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  function openQuoteForm(rfq: any) {
    setOpenForm(rfq.id);
    setForm({
      pricePerUnit: rfq.myQuotation?.pricePerUnit?.toString() || "",
      currency: rfq.myQuotation?.currency || "USD",
      leadTimeDays: rfq.myQuotation?.leadTimeDays?.toString() || "",
      termsNotes: rfq.myQuotation?.termsNotes || "",
      certifications: rfq.myQuotation?.certifications || "",
    });
  }

  async function submitQuote(rfqId: string) {
    setSubmitting(true);
    try {
      await api.submitQuotation(rfqId, {
        pricePerUnit: Number(form.pricePerUnit),
        currency: form.currency,
        leadTimeDays: Number(form.leadTimeDays),
        termsNotes: form.termsNotes,
        certifications: form.certifications,
      });
      toast.success("Quotation sent to Unpop's admin team for review.");
      setOpenForm(null);
      load();
    } catch (err) {
      toast.error(apiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <DashboardShell navItems={manufacturerNav} sectionLabel="Brand Dashboard" greeting="Orders & Leads" subtitle="Bulk quote requests matched to your products.">
      {loading ? <LoadingBlock /> : rfqs.length === 0 ? (
        <EmptyState title="No leads yet" description="You'll be notified here when a buyer's bulk quote matches your products." />
      ) : (
        <div className="space-y-4">
          {rfqs.map((r) => (
            <Card key={r.id} className="p-5">
              <div className="mb-2 flex items-start justify-between gap-3">
                <div>
                  <p className="font-display text-base text-forest-700">{r.productName}</p>
                  <p className="text-xs text-forest-400">{r.quantity} {r.unit} → {r.destinationCountry} {r.category ? `· ${r.category.name}` : ""}</p>
                </div>
                <Badge tone={r.myQuotation ? "success" : "warning"}>{r.myQuotation ? "Quoted" : "Awaiting your quote"}</Badge>
              </div>
              {r.specifications && <p className="mb-1 text-sm text-forest-500"><b>Specs:</b> {r.specifications}</p>}
              {r.deliveryTimeline && <p className="mb-3 text-sm text-forest-500"><b>Timeline:</b> {r.deliveryTimeline}</p>}

              {openForm === r.id ? (
                <div className="mt-3 grid gap-3 rounded-xl bg-cream-100 p-4 sm:grid-cols-2">
                  <div>
                    <label className="label">Price per unit</label>
                    <div className="flex gap-2">
                      <select className="input w-24 shrink-0" value={form.currency} onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value }))}>
                        {["USD", "INR", "EUR"].map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <input type="number" min="0" step="0.01" className="input" value={form.pricePerUnit} onChange={(e) => setForm((f) => ({ ...f, pricePerUnit: e.target.value }))} />
                    </div>
                  </div>
                  <div>
                    <label className="label">Lead time (days)</label>
                    <input type="number" min="1" className="input" value={form.leadTimeDays} onChange={(e) => setForm((f) => ({ ...f, leadTimeDays: e.target.value }))} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="label">Terms / notes</label>
                    <textarea rows={2} className="input" value={form.termsNotes} onChange={(e) => setForm((f) => ({ ...f, termsNotes: e.target.value }))} placeholder="e.g. FOB Chennai, 30% advance" />
                  </div>
                  <div className="sm:col-span-2 flex gap-2">
                    <button onClick={() => submitQuote(r.id)} disabled={submitting} className="btn-primary">
                      <Send size={14} /> {submitting ? "Sending..." : "Submit quotation"}
                    </button>
                    <button onClick={() => setOpenForm(null)} className="btn-ghost">Cancel</button>
                  </div>
                  <p className="text-xs text-forest-400 sm:col-span-2">
                    This goes to Unpop's admin team for review — it is never shown directly to the buyer.
                  </p>
                </div>
              ) : (
                <button onClick={() => openQuoteForm(r)} className="btn-outline text-xs">
                  {r.myQuotation ? "Update your quotation" : "Submit a quotation"}
                </button>
              )}
            </Card>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
