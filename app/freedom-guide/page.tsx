"use client";

import { Avatar, DialogueBox } from "@/components/avatar/Avatar";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/useAppStore";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import dialoguesData from "@/data/avatar-dialogues.json";

export default function FreedomGuidePage() {
  const [isTyping, setIsTyping] = useState(true);
  const router = useRouter();
  const addXp = useAppStore((state) => state.addXp);

  const handleContinue = () => {
    addXp(50);
    router.push("/role-selection");
  };

  return (
    <div className="container mx-auto px-4 py-12 min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center max-w-3xl">
      <div className="flex flex-col items-center space-y-8">
        <Avatar type="human" position="right" isSpeaking={true} className="scale-125" />
        
        <DialogueBox
          text={dialoguesData.freedomGuide.intro}
          position="right"
          onComplete={() => setIsTyping(false)}
        />

        <div className="h-16 flex items-center">
          {!isTyping && (
            <Button onClick={handleContinue} size="xl" variant="gradient">
              Choose Your Profile <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
