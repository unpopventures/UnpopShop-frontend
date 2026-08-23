import DashboardShell from "../../components/layout/DashboardShell";
import { buyerNav } from "../../components/layout/navConfig";
import MessagesPanel from "../../components/shared/MessagesPanel";

export default function BuyerMessages() {
  return (
    <DashboardShell navItems={buyerNav} sectionLabel="Buyer Dashboard" greeting="Messages" subtitle="Conversations with Unpop and manufacturers.">
      <MessagesPanel />
    </DashboardShell>
  );
}
