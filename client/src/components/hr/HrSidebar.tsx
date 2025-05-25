"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Briefcase, Users, Settings } from "lucide-react";
import { motion } from "framer-motion";

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/hr",
  },
  {
    label: "Jobs",
    icon: Briefcase,
    href: "/hr/jobs",
  },
  {
    label: "Candidates",
    icon: Users,
    href: "/hr/candidates",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/hr/settings",
  },
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
  hover: { scale: 1.02, x: 4 },
  tap: { scale: 0.98 },
};

export function HrSidebar() {
  const pathname = usePathname();

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={sidebarVariants}
      className="fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 flex-col border-r border-border/50 bg-card/80 backdrop-blur-xl overflow-y-auto"
    >
      <motion.div className="flex flex-col gap-2 p-4">
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
                  "w-full justify-start gap-3 px-4 py-6 rounded-xl transition-all duration-200",
                  pathname === route.href
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                )}
              >
                <route.icon className="h-5 w-5" />
                <span className="text-sm font-medium">{route.label}</span>
              </Button>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Bottom section */}
      <div className="mt-auto p-4">
        <motion.div variants={itemVariants} whileHover="hover" whileTap="tap">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 px-4 py-6 rounded-xl text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-all duration-200"
          ></Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
