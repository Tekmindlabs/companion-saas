"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Bot, Home, Plus, Settings, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const sidebarItems = [
  {
    icon: Home,
    label: "Home",
    href: "/dashboard",
  },
  {
    icon: Users,
    label: "Companions",
    href: "/dashboard/companions",
  },
  {
    icon: Settings,
    label: "Settings",
    href: "/dashboard/settings",
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <motion.div
      initial={{ x: -100 }}
      animate={{ x: 0 }}
      className="hidden md:flex h-screen w-64 flex-col fixed inset-y-0 z-50 bg-muted/40"
    >
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <Bot className="h-6 w-6" />
            <span className="font-bold">AI Companion</span>
          </Link>
        </div>
        <div className="px-3">
          <Button asChild className="w-full justify-start" size="sm">
            <Link href="/dashboard/companions/new">
              <Plus className="mr-2 h-4 w-4" />
              New Companion
            </Link>
          </Button>
        </div>
        <nav className="space-y-1 px-2">
          {sidebarItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center rounded-lg px-3 py-2 text-sm font-medium",
                pathname === item.href
                  ? "bg-secondary text-secondary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
              )}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </motion.div>
  );
}