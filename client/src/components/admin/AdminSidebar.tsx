"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Building2, Users, Settings } from "lucide-react";

const routes = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { label: "HR", icon: Users, href: "/admin/hr" },
  { label: "Company", icon: Building2, href: "/admin/company" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-[calc(100vh-4rem)] w-64 flex-col border-r border-[#EAF0DD] bg-gray-50">
      <div className="flex flex-col gap-2 p-4">
        {routes.map((route) => (
          <Link key={route.href} href={route.href}>
            <Button
              variant="ghost"
              className={`w-full justify-start gap-2 ${
                pathname === route.href
                  ? "hover:bg-primary bg-primary "
                  : "hover:bg-primary"
              }`}
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
