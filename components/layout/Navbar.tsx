"use client";

import Link from "next/link";
import { XPBar } from "./XPBar";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Github } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const isLanding = pathname === "/";

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/60 backdrop-blur-xl backdrop-saturate-150"
    >
      <div className="container mx-auto px-6 h-18 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 font-bold text-xl group">
          <span className="text-2xl group-hover:scale-110 transition-transform">🚀</span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-500 via-blue-600 to-purple-600 font-extrabold">
            NIRD 2025
          </span>
        </Link>

        <div className="flex items-center gap-3">
          {!isLanding && <XPBar />}
          <Button variant="ghost" size="sm" asChild className="gap-2">
            <Link href="https://github.com/Google-Developer-Student-Clubs-ISSATSo/nuit_info_2025" target="_blank">
              <Github className="w-4 h-4" />
              <span className="hidden sm:inline">GitHub</span>
            </Link>
          </Button>
        </div>
      </div>
    </motion.header>
  );
}
