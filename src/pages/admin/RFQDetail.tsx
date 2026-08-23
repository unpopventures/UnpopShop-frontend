import { useEffect, useState, FormEvent } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { ArrowLeft, Send, ShieldCheck } from "lucide-react";
import DashboardShell from "../../components/layout/DashboardShell";
import { adminNav } from "../../components/layout/navConfig";
import { Card, Badge, LoadingBlock, SectionHeading } from "../../components/ui/Primitives";
import { api, apiErrorMessage } from "../../api/client";

const statusTone: Record<string, "neutral" | "success" | "warning" | "danger" | "gold"> = {
  OPEN: "neutral", QUOTED: "gold", FINALIZED: "warning", ACCEPTED: "success", CLOSED: "danger",
};
const quoteTone: Record<string, "neutral" | "success" | "danger"> = {
  SUBMITTED: "neutral", SHORTLISTED: "success", REJECTED: "danger",
};

export default function RFQDetail() {
  const { id } = useParams();
  const [rfq, setRfq] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [finalForm, setFinalForm] = useState({ finalPricePerUnit: "", currency: "USD", deliveryTimeline: "", terms: "", supplierSummary: "" });
  const [sending, setSending] = useState(false);

  function load() {
    if (!id) return;
    setLoading(true);
    api.adminRFQ(id).then((res) => {
      setRfq(res.data.rfq);
      if (res.data.rfq.finalQuotation) {
        const fq = res.data.rfq.finalQuotation;
        setFinalForm({
          finalPricePerUnit: fq.finalPricePerUnit.toString(),
          currency: fq.currency,
          deliveryTimeline: fq.deliveryTimeline || "",
          terms: fq.terms || "",
          supplierSummary: fq.supplierSummary || "",
        });
      }
    }).finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, [id]);

  async function setQuoteStatus(quotationId: string, status: string) {
    try {
      await api.adminUpdateQuotationStatus(quotationId, status);
      load();
    } catch (err) {
      toast.error(apiErrorMessage(err));
    }
  }

  function prefillFromQuote(q: any) {
    setFinalForm({
      finalPricePerUnit: q.pricePerUnit.toString(),
      currency: q.currency,
      deliveryTimeline: `${q.leadTimeDays} days`,
      terms: q.termsNotes || "",
      supplierSummary: `Sourced via ${q.manufacturer.companyName}${q.manufacturer.state ? `, ${q.manufacturer.state}` : ""}.`,
    });
  }

  async function sendFinal(e: FormEvent) {
    e.preventDefault();
    if (!id) return;
    setSending(true);
    try {
      await api.adminSendFinalQuotation(id, finalForm);
      toast.success("Final quotation sent to the buyer.");
      load();
    } catch (err) {
      toast.error(apiErrorMessage(err));
    } finally {
      setSending(false);
    }
  }

  if (loading || !rfq) return <LoadingBlock />;

  return (
    <DashboardShell navItems={adminNav} sectionLabel="Admin Dashboard" greeting={rfq.productName} subtitle={`RFQ from ${rfq.buyer?.name} · ${rfq.buyer?.country || ""}`}>
      <Link to="/admin/rfqs" className="mb-4 inline-flex items-center gap-1 text-sm text-forest-400 hover:text-forest-600">
        <ArrowLeft size={14} /> Back to all RFQs
      </Link>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-3">
          <Card className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <SectionHeading title="Request details" />
              <Badge tone={statusTone[rfq.status]}>{rfq.status}</Badge>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
              <Detail label="Quantity" value={`${rfq.quantity} ${rfq.unit}`} />
              <Detail label="Destination" value={rfq.destinationCountry} />
              <Detail label="Category" value={rfq.category?.name || "—"} />
              <Detail label="Delivery timeline" value={rfq.deliveryTimeline || "—"} />
              <Detail label="Certifications" value={rfq.certificationsRequired || "—"} />
              <Detail label="Matched manufacturers" value={rfq.matches?.length ?? 0} />
            </div>
            {rfq.specifications && <p className="mt-3 text-sm text-forest-500"><b>Specs:</b> {rfq.specifications}</p>}
            {rfq.additionalRequirements && <p className="mt-1 text-sm text-forest-500"><b>Additional:</b> {rfq.additionalRequirements}</p>}
            <p className="mt-3 text-xs text-forest-400">Buyer contact: {rfq.buyer?.email} {rfq.buyer?.phone ? `· ${rfq.buyer.phone}` : ""}</p>
          </Card>

          <Card className="p-5">
            <SectionHeading title={`Manufacturer quotations (${rfq.quotations.length})`} />
            {rfq.quotations.length === 0 ? (
              <p className="text-sm text-forest-400">No quotations submitted yet.</p>
            ) : (
              <div className="space-y-3">
                {rfq.quotations.map((q: any) => (
                  <div key={q.id} className="rounded-xl border border-forest-100 p-4">
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <div>
                        <p className="flex items-center gap-1.5 font-medium text-forest-700">
                          {q.manufacturer.companyName}
                          {q.manufacturer.verificationStatus === "VERIFIED" && <ShieldCheck size={13} className="text-emerald-600" />}
                        </p>
                        <p className="text-xs text-forest-400">{q.manufacturer.state}</p>
                      </div>
                      <Badge tone={quoteTone[q.status]}>{q.status}</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm text-forest-600 sm:grid-cols-3">
                      <span>Price: <b>{q.currency} {q.pricePerUnit}</b>/unit</span>
                      <span>Total: <b>{q.currency} {q.totalPrice.toLocaleString()}</b></span>
                      <span>Lead time: <b>{q.leadTimeDays}d</b></span>
                    </div>
                    {q.termsNotes && <p className="mt-1 text-xs text-forest-400">{q.termsNotes}</p>}
                    <div className="mt-3 flex gap-2">
                      <button onClick={() => setQuoteStatus(q.id, "SHORTLISTED")} className="btn-outline !py-1 !px-3 text-xs">Shortlist</button>
                      <button onClick={() => setQuoteStatus(q.id, "REJECTED")} className="btn-outline !py-1 !px-3 text-xs text-red-500">Reject</button>
                      <button onClick={() => prefillFromQuote(q)} className="btn-ghost !py-1 !px-3 text-xs">Use for final quote →</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="p-5">
            <SectionHeading title="Final quotation to buyer" />
            <p className="mb-4 text-xs text-forest-400">
              This is the only quote the buyer will see. Compose it after comparing manufacturer bids — combine, negotiate, or mark up as needed.
            </p>
            <form onSubmit={sendFinal} className="space-y-3">
              <div>
                <label className="label">Final price per unit</label>
                <div className="flex gap-2">
                  <select className="input w-24 shrink-0" value={finalForm.currency} onChange={(e) => setFinalForm((f) => ({ ...f, currency: e.target.value }))}>
                    {["USD", "INR", "EUR"].map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <input required type="number" min="0" step="0.01" className="input" value={finalForm.finalPricePerUnit} onChange={(e) => setFinalForm((f) => ({ ...f, finalPricePerUnit: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="label">Delivery timeline</label>
                <input className="input" value={finalForm.deliveryTimeline} onChange={(e) => setFinalForm((f) => ({ ...f, deliveryTimeline: e.target.value }))} />
              </div>
              <div>
                <label className="label">Terms</label>
                <textarea rows={2} className="input" value={finalForm.terms} onChange={(e) => setFinalForm((f) => ({ ...f, terms: e.target.value }))} />
              </div>
              <div>
                <label className="label">Supplier summary (anonymized, shown to buyer)</label>
                <textarea rows={2} className="input" value={finalForm.supplierSummary} onChange={(e) => setFinalForm((f) => ({ ...f, supplierSummary: e.target.value }))} placeholder="e.g. Sourced from 2 verified Tamil Nadu manufacturers" />
              </div>
              <button type="submit" disabled={sending} className="btn-gold w-full">
                <Send size={15} /> {sending ? "Sending..." : rfq.finalQuotation ? "Update & resend final quote" : "Send final quote to buyer"}
              </button>
            </form>

            {rfq.finalQuotation && (
              <div className="mt-4 rounded-xl bg-cream-100 p-3 text-xs text-forest-500">
                Current status: <b>{rfq.finalQuotation.status}</b> · Sent {new Date(rfq.finalQuotation.sentAt).toLocaleString()}
              </div>
            )}
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}

function Detail({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-forest-300">{label}</p>
      <p className="text-forest-700">{value}</p>
    </div>
  );
}
