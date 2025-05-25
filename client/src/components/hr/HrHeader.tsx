"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User, Bell, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import axios from "@/utils/axios";

const headerVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

const logoVariants = {
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

const avatarVariants = {
  hover: { scale: 1.1 },
  tap: { scale: 0.9 },
};

export function HrHeader() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await axios.post("/api/v1/auth/hr/logout");
      if (response.status === 200) {
        toast.success("Logged out successfully");
        router.push("/hr/signin");
      }
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  const handleProfileClick = () => {
    router.push("/hr/profile");
  };

  return (
    <motion.header
      initial="hidden"
      animate="visible"
      variants={headerVariants}
      className="fixed top-0 left-0 w-full border-b border-border/50 bg-card/80 backdrop-blur-xl shadow-sm z-50"
    >
      <div className="flex h-16 items-center px-6 justify-between">
        <motion.div
          className="flex items-center gap-3 cursor-pointer"
          variants={logoVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={() => router.push("/hr")}
        >
          <div className="w-12 h-12 flex items-center justify-center">
            <img src="/logo.svg" alt="Recruitizy Logo" className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Recruitizy</h1>
            <p className="text-xs text-muted-foreground">HR Dashboard</p>
          </div>
        </motion.div>

        <div className="flex items-center gap-4">
          {/* Notifications */}
          {/* <Button variant="ghost" size="icon" className="relative rounded-xl">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full text-[10px] text-primary-foreground flex items-center justify-center">
              3
            </span>
          </Button> */}

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.div
                variants={avatarVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-xl p-0"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/avatars/01.png" alt="HR" />
                    <AvatarFallback className="bg-primary text-primary-foreground font-medium">
                      HR
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </motion.div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 bg-card/95 backdrop-blur-xl border-border/50 rounded-xl shadow-xl"
              align="end"
              forceMount
            >
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <DropdownMenuItem
                  className="cursor-pointer focus:bg-secondary/50 rounded-lg m-1"
                  onClick={handleProfileClick}
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                {/* <DropdownMenuItem className="cursor-pointer focus:bg-secondary/50 rounded-lg m-1">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem> */}
                <DropdownMenuItem
                  className="cursor-pointer focus:bg-destructive/10 text-destructive focus:text-destructive rounded-lg m-1"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </motion.div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.header>
  );
}
