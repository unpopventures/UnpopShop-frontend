import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Check } from "lucide-react";
import DashboardShell from "../../components/layout/DashboardShell";
import { manufacturerNav } from "../../components/layout/navConfig";
import { Card, Badge, LoadingBlock } from "../../components/ui/Primitives";
import { api, apiErrorMessage } from "../../api/client";
import { SubscriptionPlan } from "../../types";

export default function Promotions() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [currentPlanId, setCurrentPlanId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState<string | null>(null);

  function load() {
    setLoading(true);
    Promise.all([api.plans(), api.manufacturerProfile()]).then(([p, prof]) => {
      setPlans(p.data.plans);
      setCurrentPlanId(prof.data.profile.subscriptionPlan?.id || null);
    }).finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  async function subscribe(planId: string) {
    setSubscribing(planId);
    try {
      await api.subscribe(planId);
      toast.success("Subscription updated.");
      load();
    } catch (err) {
      toast.error(apiErrorMessage(err));
    } finally {
      setSubscribing(null);
    }
  }

  return (
    <DashboardShell navItems={manufacturerNav} sectionLabel="Brand Dashboard" greeting="Subscription" subtitle="Upgrade your plan to list more products.">
      {loading ? <LoadingBlock /> : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((p) => {
            const isCurrent = p.id === currentPlanId;
            return (
              <Card key={p.id} className={`flex flex-col p-6 ${isCurrent ? "ring-2 ring-gold-500" : ""}`}>
                {isCurrent && <Badge tone="gold">Current plan</Badge>}
                <h3 className="mt-2 font-display text-lg text-forest-700">{p.name}</h3>
                <p className="mt-1 text-2xl font-display font-semibold text-forest-700">
                  {p.priceInr === 0 ? "Free" : `₹${p.priceInr.toLocaleString()}`}
                  {p.priceInr > 0 && <span className="text-sm font-normal text-forest-400">/mo</span>}
                </p>
                <p className="mt-3 flex items-center gap-1.5 text-sm text-forest-500">
                  <Check size={14} className="text-emerald-600" /> Up to {p.listingLimit} active listings
                </p>
                {p.description && <p className="mt-2 text-xs text-forest-400">{p.description}</p>}
                <button
                  onClick={() => subscribe(p.id)}
                  disabled={isCurrent || subscribing === p.id}
                  className={`mt-6 ${isCurrent ? "btn-outline" : "btn-primary"}`}
                >
                  {isCurrent ? "Active" : subscribing === p.id ? "Updating..." : "Choose plan"}
                </button>
              </Card>
            );
          })}
        </div>
      )}
    </DashboardShell>
  );
}
