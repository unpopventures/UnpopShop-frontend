import { useEffect, useState } from "react";
import DashboardShell from "../../components/layout/DashboardShell";
import { buyerNav } from "../../components/layout/navConfig";
import { Badge, LoadingBlock, EmptyState } from "../../components/ui/Primitives";
import AdminTable, { Column } from "../../components/shared/AdminTable";
import { api } from "../../api/client";
import { Order } from "../../types";

const tone: Record<string, "neutral" | "success" | "warning" | "danger" | "gold"> = {
  PENDING: "warning",
  CONFIRMED: "gold",
  SHIPPED: "neutral",
  DELIVERED: "success",
  CANCELLED: "danger",
};

export default function BuyerOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.myOrders().then((res) => setOrders(res.data.orders)).finally(() => setLoading(false));
  }, []);

  const columns: Column<Order>[] = [
    { header: "Product", render: (o) => o.product?.name || "—" },
    { header: "Manufacturer", render: (o) => o.manufacturer?.companyName || "—" },
    { header: "Quantity", render: (o) => `${o.quantity} ${o.unit}` },
    { header: "Amount", render: (o) => `${o.currency} ${o.totalAmount.toLocaleString()}` },
    { header: "Status", render: (o) => <Badge tone={tone[o.status]}>{o.status}</Badge> },
    { header: "Date", render: (o) => new Date(o.createdAt).toLocaleDateString() },
  ];

  return (
    <DashboardShell navItems={buyerNav} sectionLabel="Buyer Dashboard" greeting="Orders" subtitle="Track orders placed through Unpop.shop.">
      {loading ? <LoadingBlock /> : orders.length === 0 ? (
        <EmptyState title="No orders yet" description="Orders appear here once a final quotation is accepted and fulfilled." />
      ) : (
        <AdminTable columns={columns} rows={orders} />
      )}
    </DashboardShell>
  );
}
