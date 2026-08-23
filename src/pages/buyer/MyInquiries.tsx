import { useEffect, useState } from "react";
import DashboardShell from "../../components/layout/DashboardShell";
import { buyerNav } from "../../components/layout/navConfig";
import { Card, Badge, LoadingBlock, EmptyState } from "../../components/ui/Primitives";
import { api } from "../../api/client";
import { Enquiry } from "../../types";

export default function MyInquiries() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.myEnquiries().then((res) => setEnquiries(res.data.enquiries)).finally(() => setLoading(false));
  }, []);

  return (
    <DashboardShell navItems={buyerNav} sectionLabel="Buyer Dashboard" greeting="My Inquiries" subtitle="Product enquiries you've sent to manufacturers.">
      {loading ? <LoadingBlock /> : enquiries.length === 0 ? (
        <EmptyState title="No inquiries yet" description="Send an enquiry from any product page." />
      ) : (
        <div className="space-y-3">
          {enquiries.map((e) => (
            <Card key={e.id} className="flex items-start justify-between gap-4 p-4">
              <div>
                <p className="font-display text-sm font-semibold text-forest-700">{e.product.name}</p>
                <p className="text-xs text-forest-400">{e.product.manufacturer?.companyName}</p>
                <p className="mt-2 text-sm text-forest-500">{e.message}</p>
              </div>
              <Badge tone={e.status === "OPEN" ? "warning" : e.status === "RESPONDED" ? "success" : "neutral"}>{e.status}</Badge>
            </Card>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
