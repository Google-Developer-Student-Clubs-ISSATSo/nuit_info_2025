"use client";

import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/useAppStore";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle, Trophy } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import productsData from "@/data/open-source-products.json";
import { toast } from "sonner"; // We might need to install sonner or just use a simple alert/custom toast for MVP. I'll use a custom simple toast for now or just alert.

export default function SetupPage() {
  const params = useParams();
  const router = useRouter();
  const addXp = useAppStore((state) => state.addXp);
  const [isCompleted, setIsCompleted] = useState(false);

  const productId = params.id as string;
  const product = productsData.find((p) => p.id === productId);

  if (!product) {
    return <div className="container mx-auto p-12 text-center">Product not found</div>;
  }

  const handleComplete = () => {
    if (!isCompleted) {
      addXp(200);
      setIsCompleted(true);
      // Simple alert for MVP since we didn't install a toast library, 
      // but the XP bar update will be visible.
      // Ideally we'd use a toast here.
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-[calc(100vh-4rem)] flex flex-col">
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/alternatives">
            <ArrowLeft className="mr-2 w-4 h-4" /> Back to Alternatives
          </Link>
        </Button>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          Setup Guide: <span className="text-primary">{product.name}</span>
        </h1>
        <p className="text-muted-foreground mt-2">
          Follow the steps below to install and configure {product.name}.
        </p>
      </div>

      <div className="flex-1 grid lg:grid-cols-3 gap-8">
        {/* Steps Sidebar */}
        <div className="space-y-6">
          <div className="bg-card border rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold mb-4">Installation Steps</h3>
            <ol className="space-y-4 relative border-l-2 border-muted ml-2 pl-6">
              {[
                "Download the installer",
                "Run the setup wizard",
                "Configure basic settings",
                "Create your admin account",
                "Connect to the network"
              ].map((step, i) => (
                <li key={i} className="relative">
                  <span className="absolute -left-[31px] top-0 w-6 h-6 rounded-full bg-secondary border-2 border-background flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </span>
                  <p className="text-sm font-medium">{step}</p>
                  <p className="text-xs text-muted-foreground mt-1">Estimated time: 2 mins</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
            <h3 className="font-semibold flex items-center gap-2 text-primary mb-2">
              <Trophy className="w-5 h-5" />
              Reward Available
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Complete this tutorial to earn <span className="font-bold text-foreground">200 XP</span>!
            </p>
            <Button 
              className="w-full" 
              onClick={handleComplete}
              disabled={isCompleted}
              variant={isCompleted ? "secondary" : "default"}
            >
              {isCompleted ? (
                <>
                  <CheckCircle className="mr-2 w-4 h-4" /> Completed
                </>
              ) : (
                "Complete Preview"
              )}
            </Button>
          </div>
        </div>

        {/* Main Content - Fake Google Form / Iframe */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg border overflow-hidden h-[600px] relative"
          >
            {/* Fake Browser Header */}
            <div className="bg-gray-100 border-b p-3 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 bg-white rounded-md px-3 py-1 text-xs text-gray-500 text-center mx-4 font-mono">
                docs.google.com/forms/d/e/...
              </div>
            </div>

            {/* Fake Form Content */}
            <div className="p-8 h-full overflow-y-auto bg-purple-50">
              <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm border-t-8 border-t-purple-600 p-8 space-y-6">
                <div className="space-y-2 border-b pb-6">
                  <h1 className="text-3xl font-normal text-black">
                    {product.name} Setup Quiz
                  </h1>
                  <p className="text-gray-600">
                    Verify your understanding of the installation process.
                  </p>
                  <div className="text-red-600 text-sm">* Required</div>
                </div>

                <div className="space-y-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <label className="block text-base font-medium text-black">
                    Which operating system are you using? <span className="text-red-600">*</span>
                  </label>
                  <div className="space-y-2">
                    {["Windows", "Linux", "macOS"].map((opt) => (
                      <div key={opt} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full border-2 border-gray-400" />
                        <span className="text-gray-700">{opt}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <label className="block text-base font-medium text-black">
                    Did you successfully download the package? <span className="text-red-600">*</span>
                  </label>
                  <div className="space-y-2">
                    {["Yes", "No", "I'm stuck"].map((opt) => (
                      <div key={opt} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full border-2 border-gray-400" />
                        <span className="text-gray-700">{opt}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="pt-4 flex justify-between items-center">
                    <div className="h-2 w-32 bg-green-200 rounded-full overflow-hidden">
                        <div className="h-full w-1/2 bg-green-600" />
                    </div>
                    <span className="text-xs text-gray-500">Page 1 of 2</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
