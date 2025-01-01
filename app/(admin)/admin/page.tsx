import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { AdminHeader } from "@/components/admin/admin-header";

export default function AdminPage() {
  return (
    <div className="space-y-8">
      <AdminHeader
        heading="Admin Dashboard"
        text="Manage your system and users"
      />
      <AdminDashboard />
    </div>
  );
}