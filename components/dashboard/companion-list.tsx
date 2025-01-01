"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CompanionList() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
    >
      <Link href="/dashboard/companions/new">
        <Button
          variant="outline"
          className="h-[320px] w-full flex flex-col items-center justify-center gap-4"
        >
          <Plus className="h-8 w-8" />
          <p className="text-lg font-medium">Create New Companion</p>
        </Button>
      </Link>
    </motion.div>
  );
}