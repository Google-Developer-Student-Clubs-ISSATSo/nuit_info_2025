"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppStore } from "@/store/useAppStore";
import { motion } from "framer-motion";
import { Lock, Unlock } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RouteSelectionPage() {
  const setRoute = useAppStore((state) => state.setRoute);
  const addXp = useAppStore((state) => state.addXp);
  const router = useRouter();

  const handleSelect = (route: "freedom" | "traditional") => {
    setRoute(route);
    addXp(50); // Reward for making a choice
    router.push("/debate");
  };

  return (
    <div className="container mx-auto px-4 py-12 min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12 space-y-4"
      >
        <h1 className="text-4xl font-bold">Choose Your Path</h1>
        <p className="text-xl text-muted-foreground">
          Two roads diverge in a digital wood...
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full">
        {/* Traditional Route */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          <Card
            className="h-full cursor-pointer hover:border-primary/50 transition-colors relative overflow-hidden group"
            onClick={() => handleSelect("traditional")}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="relative z-10">
              <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-4">
                <Lock className="w-6 h-6" />
              </div>
              <CardTitle>Traditional Route</CardTitle>
              <CardDescription>The familiar path of proprietary software.</CardDescription>
            </CardHeader>
            <CardContent className="relative z-10 space-y-4">
              <p className="text-sm text-muted-foreground">
                Stick to what you know. It&apos;s comfortable, standard, but comes with restrictions and costs.
              </p>
              <ul className="text-sm space-y-2 list-disc list-inside text-muted-foreground">
                <li>Standard industry tools</li>
                <li>Vendor lock-in</li>
                <li>Subscription fees</li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/* Freedom Route */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          <Card
            className="h-full cursor-pointer border-primary/20 hover:border-primary transition-colors relative overflow-hidden group"
            onClick={() => handleSelect("freedom")}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="relative z-10">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Unlock className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-primary">Freedom Route</CardTitle>
              <CardDescription>The empowering path of Open Source.</CardDescription>
            </CardHeader>
            <CardContent className="relative z-10 space-y-4">
              <p className="text-sm text-muted-foreground">
                Explore a world of transparency, community, and control. Own your tools and your data.
              </p>
              <ul className="text-sm space-y-2 list-disc list-inside text-muted-foreground">
                <li>Community driven</li>
                <li>Full transparency</li>
                <li>No licensing fees</li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
