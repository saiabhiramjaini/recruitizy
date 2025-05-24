"use client";

import { useState } from "react";

import { HrForm } from "@/components/admin/HrForm";
import { HrTable } from "@/components/admin/HrTable";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function HRPage() {
  const [openHR, setOpenHR] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">HR Management</h2>
          <p className="text-sm text-muted-foreground">
            Manage your HR details here.
          </p>
        </div>

        <Dialog open={openHR} onOpenChange={setOpenHR}>
          <DialogTrigger asChild>
            <Button onClick={() => setOpenHR(true)} className="gap-2">
              <Plus className="h-4 w-4" /> Add HR
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg bg-white overflow-y-auto max-h-[80vh]">
            <DialogTitle>Add HR</DialogTitle>
            <HrForm />
          </DialogContent>
        </Dialog>
      </div>

      <HrTable />
    </div>
  );
}
