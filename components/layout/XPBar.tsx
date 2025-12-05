"use client";

import { useAppStore } from "@/store/useAppStore";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

export function XPBar() {
  const xp = useAppStore((state) => state.xp);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex items-center gap-3 bg-gradient-to-r from-amber-500/10 to-orange-500/10 px-4 py-2 rounded-full border border-amber-500/20 backdrop-blur-sm">
      <Sparkles className="w-4 h-4 text-amber-500" />
      <div className="flex items-center gap-3">
        <span className="font-bold text-sm text-amber-600 dark:text-amber-400">{xp} XP</span>
        <div className="w-20 h-2 bg-amber-200/50 dark:bg-amber-900/50 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((xp / 1000) * 100, 100)}%` }}
            transition={{ duration: 0.8, type: "spring" }}
          />
        </div>
      </div>
    </div>
  );
}
