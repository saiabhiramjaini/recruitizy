import { ReactNode } from "react";
import { HrSidebar } from "@/components/hr/HrSidebar";
import { HrHeader } from "@/components/hr/HrHeader";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background flex flex-col">
      <HrHeader />
      <div className="flex flex-1">
        <HrSidebar />
        <main className="flex-1 p-8 pt-24 pl-64 overflow-y-auto bg-gradient-to-br from-background/50 to-secondary/30">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
