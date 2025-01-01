"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Users, 
  Settings, 
  BarChart, 
  Shield,
  Database,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarItems = [
  {
    icon: BarChart,
    label: "Dashboard",
    href: "/admin",
  },
  {
    icon: Users,
    label: "Users",
    href: "/admin/users",
  },
  {
    icon: Database,
    label: "Content",
    href: "/admin/content",
  },
  {
    icon: Shield,
    label: "Access Control",
    href: "/admin/access",
  },
  {
    icon: Activity,
    label: "Audit Logs",
    href: "/admin/audit-logs",
  },
  {
    icon: Settings,
    label: "Settings",
    href: "/admin/settings",
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 h-screen bg-muted/40 p-4 space-y-4">
      <div className="font-bold text-xl px-4 py-2">
        Admin Panel
      </div>
      <nav className="space-y-2">
        {sidebarItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors",
              pathname === item.href
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}