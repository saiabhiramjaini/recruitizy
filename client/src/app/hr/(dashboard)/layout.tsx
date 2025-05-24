import { ReactNode } from "react";
import { Sidebar } from "@/components/hr/Sidebar";
import { Header } from "@/components/hr/Header";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F7F8F5]">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
} 