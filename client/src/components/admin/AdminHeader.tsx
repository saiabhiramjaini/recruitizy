"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import axios from "@/utils/axios";

export function AdminHeader() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await axios.post("/api/v1/auth/admin/logout");
      if (response.status === 200) {
        toast.success("Logged out successfully");
        router.push("/signin");
      }
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  const handleProfileClick = () => {
    router.push("/dashboard/profile");
  };

  return (
    <header className="border-b border-[#EAF0DD] ">
      <div className="flex h-16 items-center px-6 justify-between">
        <div className="flex items-center gap-2">
          <img
            src="/logo.svg"
            alt="Recruitizy Logo"
            className="h-10 w-auto object-contain"
          />
          <h1 className="text-xl font-semibold text-[#00000]">Recruitizy</h1>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/avatars/01.png" alt="Admin" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuItem className="cursor-pointer" onClick={handleProfileClick}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}