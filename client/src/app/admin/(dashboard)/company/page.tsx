import { CompanyInfo } from "@/components/admin/CompanyInfo";

export default function CompanyPage() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-3xl font-bold tracking-tight">Company Management</h2>
      <p className="text-sm text-muted-foreground">
        Manage your company details and settings here.
      </p>

      <CompanyInfo/>
    </div>
  );
}
