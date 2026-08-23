import DashboardShell from "../../components/layout/DashboardShell";
import { manufacturerNav } from "../../components/layout/navConfig";
import MessagesPanel from "../../components/shared/MessagesPanel";

export default function ManufacturerMessages() {
  return (
    <DashboardShell navItems={manufacturerNav} sectionLabel="Brand Dashboard" greeting="Messages" subtitle="Conversations with Unpop and buyers.">
      <MessagesPanel />
    </DashboardShell>
  );
}
