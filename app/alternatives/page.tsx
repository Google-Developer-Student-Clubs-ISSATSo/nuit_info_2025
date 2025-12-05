"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppStore } from "@/store/useAppStore";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import productsData from "@/data/open-source-products.json";

export default function AlternativesPage() {
  const role = useAppStore((state) => state.role);

  return (
    <div className="container mx-auto px-4 py-12 min-h-[calc(100vh-4rem)]">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12 space-y-4"
      >
        <h1 className="text-4xl font-bold">Open Source Alternatives</h1>
        <p className="text-xl text-muted-foreground">
          Powerful tools to replace your proprietary software.
          {role && <span className="block mt-2 text-primary font-medium">Recommended for: {role.charAt(0).toUpperCase() + role.slice(1)}</span>}
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {productsData.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full flex flex-col hover:shadow-lg transition-shadow overflow-hidden">
              <div className="h-48 bg-secondary/30 flex items-center justify-center relative overflow-hidden group">
                {/* Placeholder Image Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10" />
                <span className="text-4xl font-bold text-muted-foreground/20 group-hover:scale-110 transition-transform duration-500">
                  {product.name.substring(0, 2)}
                </span>
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{product.name}</CardTitle>
                    <CardDescription className="mt-1">{product.category}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {product.description}
                </p>
              </CardContent>
              <CardFooter className="pt-4 border-t bg-secondary/10">
                <Button className="w-full" asChild>
                  <Link href={`/setup/${product.id}`} className="whitespace-nowrap flex gap-0">
                    Setup Instructions <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
