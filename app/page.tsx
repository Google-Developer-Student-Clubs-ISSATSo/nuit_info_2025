"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to debate page immediately
    router.push("/debate");
  }, [router]);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
      <div className="text-center">
        <p className="text-muted-foreground">Redirection vers le débat...</p>
      </div>
    </div>
  );
}
