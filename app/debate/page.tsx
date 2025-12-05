"use client";

import { Avatar, DialogueBox } from "@/components/avatar/Avatar";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/useAppStore";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Play, Pause, Volume2, VolumeX, SkipForward, FastForward, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef, useCallback } from "react";
import dialoguesData from "@/data/avatar-dialogues.json";
import { generateDebate } from "@/app/actions/generate-debate";

export default function DebatePage() {
  const [dialogues, setDialogues] = useState<DialogueLine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [skipCurrent, setSkipCurrent] = useState(false);
  
  const [dialogues, setDialogues] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();
  const addXp = useAppStore((state) => state.addXp);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // const dialogues = dialoguesData.debate;
  const currentLine = dialogues[currentLineIndex];
  const isFinished = !isLoading && currentLineIndex >= dialogues.length;

  useEffect(() => {
    const fetchDialogues = async () => {
      setIsLoading(true);
      try {
        const data = await generateDebate();
        console.log("Fetched Debate Data:", data);
        if (data && data.debate) {
          setDialogues(data.debate);
        } else {
          setDialogues(dialoguesData.debate);
        }
      } catch (error) {
        console.error("Failed to fetch debate:", error);
        setDialogues(dialoguesData.debate);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDialogues();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Handle navigation to next line
  const goToNext = useCallback(() => {
    if (currentLineIndex < dialogues.length - 1) {
      setCurrentLineIndex((prev) => prev + 1);
      setIsTypingComplete(false);
      setSkipCurrent(false);
    } else {
      addXp(100);
      router.push("/role-selection");
    }
  }, [currentLineIndex, dialogues.length, addXp, router]);

  // Handle TTS
  useEffect(() => {
    if (isLoading || isFinished || isMuted || !currentLine) return;
    if (isLoading || isFinished || isMuted || !currentLine) return;

    window.speechSynthesis.cancel();
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    const speak = () => {
      const utterance = new SpeechSynthesisUtterance(currentLine.text);
      utterance.lang = "fr-FR";
      utterance.rate = 1.1;
      utterance.pitch = currentLine.speaker === "freedom" ? 1.15 : 0.85;

      const voices = window.speechSynthesis.getVoices();
      const frenchVoices = voices.filter(v => v.lang.includes("fr"));
      if (frenchVoices.length > 0) {
        utterance.voice = frenchVoices[0];
      }

      utterance.onend = () => {
        setIsTypingComplete(true);
        if (isPlaying) {
          timeoutRef.current = setTimeout(goToNext, 800);
        }
      };

      speechRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    };

    const startTimeout = setTimeout(speak, 100);
    return () => clearTimeout(startTimeout);
  }, [currentLineIndex, isMuted, isFinished, currentLine, isPlaying, goToNext, isLoading]);
  }, [currentLineIndex, isMuted, isFinished, currentLine, isPlaying, goToNext, isLoading]);

  const handleSkip = () => {
    window.speechSynthesis.cancel();
    setSkipCurrent(true);
    setIsTypingComplete(true);
  };

  const handleNext = () => {
    window.speechSynthesis.cancel();
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    goToNext();
  };

  const togglePlay = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!isMuted) {
      window.speechSynthesis.cancel();
    }
    setIsMuted(!isMuted);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
        <p className="text-xl text-muted-foreground">Génération du débat en cours...</p>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="container mx-auto px-4 py-12 min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6"
        >
          <h1 className="text-4xl font-bold">Débat Terminé ! 🎉</h1>
          <p className="text-xl text-muted-foreground">Alex est convaincu. Et toi ?</p>
          <div className="flex gap-4 justify-center">
            <Button onClick={fetchDebate} size="lg" variant="outline" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Nouveau débat
            </Button>
            <Button onClick={() => router.push("/role-selection")} size="xl" variant="gradient">
              Continuer <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!currentLine) return null;

  return (
    <div className="container mx-auto px-4 py-6 min-h-[calc(100vh-4rem)] flex flex-col max-w-4xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Le Grand Débat</h1>
          <p className="text-sm text-muted-foreground">
            {currentLineIndex + 1} / {dialogues.length} • Généré par IA ✨
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={fetchDebate} title="Nouveau débat">
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={toggleMute} title={isMuted ? "Activer le son" : "Couper le son"}>
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </Button>
          <Button variant="outline" size="icon" onClick={togglePlay} title={isPlaying ? "Pause" : "Lecture"}>
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-secondary rounded-full mb-8 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
          initial={{ width: 0 }}
          animate={{ width: `${((currentLineIndex + 1) / dialogues.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Main Debate Area */}
      <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
        {/* Alex (Traditional) */}
        <motion.div
          animate={{
            opacity: currentLine.speaker === "traditional" ? 1 : 0.4,
            scale: currentLine.speaker === "traditional" ? 1 : 0.9,
          }}
          className="flex flex-col items-center gap-4"
        >
          <Avatar
            type="robot"
            name="Alex"
            emoji={currentLine.speaker === "traditional" ? currentLine.emoji : "👨‍💼"}
            position="left"
            isSpeaking={currentLine.speaker === "traditional"}
          />
        </motion.div>

        {/* Center Dialogue Box */}
        <div className="flex-1 max-w-md w-full">
          <AnimatePresence mode="wait">
            <DialogueBox
              key={currentLineIndex}
              text={currentLine.text}
              position={currentLine.speaker === "traditional" ? "left" : "right"}
              speakerType={currentLine.speaker === "freedom" ? "human" : "robot"}
              isComplete={skipCurrent}
              onComplete={() => setIsTypingComplete(true)}
            />
          </AnimatePresence>
        </div>

        {/* Sophie (Freedom) */}
        <motion.div
          animate={{
            opacity: currentLine.speaker === "freedom" ? 1 : 0.4,
            scale: currentLine.speaker === "freedom" ? 1 : 0.9,
          }}
          className="flex flex-col items-center gap-4"
        >
          <Avatar
            type="human"
            name="Sophie"
            emoji={currentLine.speaker === "freedom" ? currentLine.emoji : "👩‍🏫"}
            position="right"
            isSpeaking={currentLine.speaker === "freedom"}
          />
        </motion.div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4 mt-8 pt-6 border-t">
        <Button
          variant="outline"
          onClick={handleSkip}
          disabled={isTypingComplete}
          className="gap-2"
        >
          <SkipForward className="w-4 h-4" />
          Passer le texte
        </Button>
        <Button
          onClick={handleNext}
          className="gap-2"
          variant={isTypingComplete ? "default" : "secondary"}
        >
          Suivant
          <FastForward className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
