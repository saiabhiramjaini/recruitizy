"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Building2, Users, Settings } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const routes = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { label: "HR", icon: Users, href: "/admin/hr" },
  { label: "Company", icon: Building2, href: "/admin/company" },
];

const sidebarVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 },
  hover: { scale: 1.02 },
  tap: { scale: 0.98 }
};

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={sidebarVariants}
      className="flex h-[calc(100vh-4rem)] w-64 flex-col border-r border-sidebar-border bg-sidebar"
    >
      <motion.div className="flex flex-col gap-1 p-4">
        {routes.map((route) => (
          <motion.div 
            key={route.href} 
            variants={itemVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Link href={route.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 px-4 py-6 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  pathname === route.href
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground"
                )}
              >
                <route.icon className="h-5 w-5" />
                <span className="text-sm font-medium">{route.label}</span>
              </Button>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}