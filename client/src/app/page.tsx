"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Building, Users, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RoleSelect() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const router = useRouter();
  const roles = [
    {
      id: "admin",
      title: "Company Admin",
      description: "Create company profiles and manage HR personnel",
      icon: <Building className="h-8 w-8" />,
      color: "bg-[#A9ED42]",
      borderColor: "border-[#EAF0DD]",
      bgColor: "bg-[#F0FFD1]",
      link: "/admin/signin",
    },
    {
      id: "hr",
      title: "HR Manager",
      description: "Post jobs and manage applications",
      icon: <Users className="h-8 w-8" />,
      color: "bg-[#A9ED42]",
      borderColor: "border-[#EAF0DD]",
      bgColor: "bg-[#F0FFD1]",
      link: "/hr/signin",
    },
  ];

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
    // Find the selected role
    const role = roles.find((r) => r.id === roleId);
    if (role) {
      // Navigate to the role's link after a short delay for visual feedback
      setTimeout(() => {
        router.push(role.link);
      }, 300);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8F5] flex flex-col">
      <main className="flex-1 flex items-center justify-center px-4 pb-8">
        <div className="w-full max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-xl px-6 py-10 sm:px-8 md:px-12"
          >
            <div className="text-center mb-10">
              <h1 className="text-3xl sm:text-4xl font-bold text-[#57534E] mb-3">
                Select Your Role
              </h1>
              <p className="text-base sm:text-lg text-[#57534E]/80">
                Choose your role to access the appropriate features and workflow
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {roles.map((role) => (
                <motion.div
                  key={role.id}
                  className={`border ${
                    role.borderColor
                  } rounded-xl p-6 cursor-pointer group transition-all duration-200 ${
                    selectedRole === role.id
                      ? `${role.bgColor} ring-2 ring-offset-2 ring-[#A9ED42]`
                      : "hover:bg-[#F0FFD1]/50"
                  }`}
                  onClick={() => handleRoleSelect(role.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div
                    className={`${role.color} text-white p-3 rounded-lg inline-block mb-4`}
                  >
                    {role.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-[#57534E] mb-2">
                    {role.title}
                  </h3>
                  <p className="text-[#57534E]/80 mb-4">{role.description}</p>
                  <div
                    className={`h-1 ${
                      selectedRole === role.id ? "w-full" : "w-12"
                    } ${role.color} rounded transition-all duration-300`}
                  ></div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
