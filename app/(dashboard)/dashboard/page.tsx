import { CompanionList } from "@/components/dashboard/companion-list";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export default function DashboardPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Dashboard"
        text="Manage your AI companions and conversations."
      />
      <CompanionList />
    </DashboardShell>
  );
}