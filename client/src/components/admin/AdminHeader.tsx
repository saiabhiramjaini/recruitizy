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
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import axios from "@/utils/axios";

const headerVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

const logoVariants = {
  hover: { scale: 1.05 },
  tap: { scale: 0.95 }
};

const avatarVariants = {
  hover: { scale: 1.1 },
  tap: { scale: 0.9 }
};

export function AdminHeader() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await axios.post("/api/v1/auth/admin/logout");
      if (response.status === 200) {
        toast.success("Logged out successfully");
        router.push("/admin/signin");
      }
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  const handleProfileClick = () => {
    router.push("/admin/profile");
  };

  return (
    <motion.header 
      initial="hidden"
      animate="visible"
      variants={headerVariants}
      className="border-b border-border bg-card"
    >
      <div className="flex h-16 items-center px-6 justify-between">
        <motion.div 
          className="flex items-center gap-2 cursor-pointer"
          variants={logoVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={() => router.push("/admin")}
        >
          <img
            src="/logo.svg"
            alt="Recruitizy Logo"
            className="h-10 w-auto object-contain"
          />
          <h1 className="text-xl font-semibold text-card-foreground">Recruitizy</h1>
        </motion.div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <motion.div
              variants={avatarVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Button 
                variant="ghost" 
                className="relative h-10 w-10 rounded-full p-0"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/avatars/01.png" alt="Admin" />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    AD
                  </AvatarFallback>
                </Avatar>
              </Button>
            </motion.div>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            className="w-56 bg-popover text-popover-foreground border-border"
            align="end" 
            forceMount
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <DropdownMenuItem 
                className="cursor-pointer focus:bg-accent focus:text-accent-foreground"
                onClick={handleProfileClick}
              >
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="cursor-pointer focus:bg-accent focus:text-accent-foreground"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </motion.div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.header>
  );
}