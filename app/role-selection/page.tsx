/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppStore } from "@/store/useAppStore";
import { motion } from "framer-motion";
import { Building2, GraduationCap, User, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import rolesData from "@/data/roles.json";

const iconMap: Record<string, any> = {
  GraduationCap,
  Building2,
  User,
};

export default function RoleSelectionPage() {
  const setRole = useAppStore((state) => state.setRole);
  const addXp = useAppStore((state) => state.addXp);
  const router = useRouter();

  const handleSelect = (roleId: string) => {
    setRole(roleId as any);
    addXp(50);
    router.push("/alternatives");
  };

  return (
    <div className="container mx-auto px-4 py-12 min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12 space-y-4"
      >
        <h1 className="text-4xl font-bold">Who Are You?</h1>
        <p className="text-xl text-muted-foreground">
          Select your profile to get personalized recommendations.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6 max-w-6xl w-full">
        {rolesData.map((role, index) => {
          const Icon = iconMap[role.icon];
          return (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                className="h-full cursor-pointer hover:border-primary transition-colors group relative overflow-hidden"
                onClick={() => handleSelect(role.id)}
              >
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader className="flex flex-col items-center text-center relative z-10">
                  <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle>{role.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center relative z-10">
                  <p className="text-muted-foreground">{role.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
