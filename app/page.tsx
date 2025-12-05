"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-secondary/20 overflow-hidden relative">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-1/2 -right-1/2 w-[1000px] h-[1000px] bg-blue-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute -bottom-1/2 -left-1/2 w-[800px] h-[800px] bg-purple-500/10 rounded-full blur-3xl"
        />
      </div>

      <div className="container max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center lg:text-left space-y-8"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium"
          >
            <Sparkles className="w-4 h-4" />
            <span>Nuit de l'Info 2025 Challenge</span>
          </motion.div>

          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-tight">
            Choose Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Digital Destiny
            </span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            Embark on an interactive journey to discover the power of Open Source.
            Will you stick to the traditional path, or embrace the freedom of choice?
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Button size="xl" variant="gradient" asChild className="group">
              <Link href="/route-selection">
                Start the Journey
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button size="xl" variant="outline" asChild>
              <Link href="https://github.com/Google-Developer-Student-Clubs-ISSATSo/nuit_info_2025" target="_blank">
                View Source
              </Link>
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative hidden lg:block"
        >
          {/* Abstract Illustration Placeholder */}
          <div className="relative w-full aspect-square">
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-3xl backdrop-blur-sm border border-white/10 shadow-2xl"
            />
            <motion.div
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute inset-4 bg-card rounded-2xl shadow-xl flex items-center justify-center overflow-hidden"
            >
              <div className="grid grid-cols-2 gap-4 p-8 w-full h-full opacity-50">
                <div className="bg-primary/10 rounded-lg h-32 w-full animate-pulse" />
                <div className="bg-secondary/20 rounded-lg h-32 w-full animate-pulse delay-75" />
                <div className="bg-secondary/20 rounded-lg h-32 w-full animate-pulse delay-150" />
                <div className="bg-primary/10 rounded-lg h-32 w-full animate-pulse delay-300" />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
