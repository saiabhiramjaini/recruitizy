"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Briefcase, Users, Settings } from "lucide-react";

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
];

export function HrSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-[calc(100vh-4rem)] w-64 flex-col border-r ">
      <div className="flex flex-col gap-2 p-4">
        {routes.map((route) => (
          <Link key={route.href} href={route.href}>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-2",
                pathname === route.href
                  ? "bg-[#F0FFD1] text-[#A9ED42] hover:bg-[#F0FFD1] hover:text-[#A9ED42]"
                  : "hover:bg-[#F7F8F5]"
              )}
            >
              <route.icon className="h-5 w-5" />
              {route.label}
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
} 