import { ReactNode } from "react";
import { HrSidebar } from "@/components/hr/HrSidebar";
import { HrHeader } from "@/components/hr/HrHeader";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F7F8F5]">
      <HrHeader />
      <div className="flex">
        <HrSidebar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
} 