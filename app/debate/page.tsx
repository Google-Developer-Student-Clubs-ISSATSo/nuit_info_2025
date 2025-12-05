"use client";

import { Avatar, DialogueBox } from "@/components/avatar/Avatar";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/useAppStore";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Play, Pause, Volume2, VolumeX, SkipForward, FastForward } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef, useCallback } from "react";
import dialoguesData from "@/data/avatar-dialogues.json";

export default function DebatePage() {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true); // Auto-play by default
  const [isMuted, setIsMuted] = useState(false);
  const [skipCurrent, setSkipCurrent] = useState(false);
  const router = useRouter();
  const addXp = useAppStore((state) => state.addXp);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const dialogues = dialoguesData.debate;
  const currentLine = dialogues[currentLineIndex];
  const isFinished = currentLineIndex >= dialogues.length;

  // Auto-scroll to bottom when new message appears
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [currentLineIndex, isTypingComplete]);

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
      router.push("/route-selection");
    }
  }, [currentLineIndex, dialogues.length, addXp, router]);

  // Handle TTS
  useEffect(() => {
    if (isFinished || isMuted) return;

    window.speechSynthesis.cancel();
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    const speak = () => {
      const utterance = new SpeechSynthesisUtterance(currentLine.text);
      utterance.lang = "fr-FR";
      utterance.rate = 1.1; // Slightly faster
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

    // Small delay to let animation start
    const startTimeout = setTimeout(speak, 100);
    return () => clearTimeout(startTimeout);
  }, [currentLineIndex, isMuted, isFinished, currentLine, isPlaying, goToNext]);

  // Skip current dialogue text (instant complete)
  const handleSkip = () => {
    window.speechSynthesis.cancel();
    setSkipCurrent(true);
    setIsTypingComplete(true);
  };

  // Skip to next dialogue
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
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => router.push("/route-selection")} size="xl" variant="gradient">
              Choisir Votre Route <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button onClick={() => router.push("/freedom-guide")} size="xl" variant="outline">
              Continuer l'Aventure <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Get all previous dialogues and current one
  const previousDialogues = dialogues.slice(0, currentLineIndex);
  const allDialogues = [...previousDialogues, currentLine];

  return (
    <div className="container mx-auto px-4 py-6 min-h-[calc(100vh-4rem)] flex flex-col max-w-4xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Le Grand Débat</h1>
          <p className="text-sm text-muted-foreground">
            {currentLineIndex + 1} / {dialogues.length}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={toggleMute} title={isMuted ? "Activer le son" : "Couper le son"}>
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </Button>
          <Button variant="outline" size="icon" onClick={togglePlay} title={isPlaying ? "Pause" : "Lecture"}>
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-secondary rounded-full mb-6 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
          initial={{ width: 0 }}
          animate={{ width: `${((currentLineIndex + 1) / dialogues.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Chat History Container */}
      <div 
        ref={chatContainerRef}
        className="flex-1 flex flex-col gap-4 mb-6 overflow-y-auto max-h-[calc(100vh-20rem)] pr-2 scroll-smooth"
      >
        {/* Previous Messages */}
        {previousDialogues.map((dialogue, index) => {
          const isLeft = dialogue.speaker === "traditional";
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex gap-3 ${isLeft ? "justify-start" : "justify-end"}`}
            >
              {isLeft && (
                <Avatar
                  type="robot"
                  name="Alex"
                  emoji={dialogue.emoji}
                  position="left"
                  isSpeaking={false}
                  className="flex-shrink-0"
                />
              )}
              <div className={`max-w-[70%] ${isLeft ? "" : "flex flex-col items-end"}`}>
                <DialogueBox
                  text={dialogue.text}
                  position={isLeft ? "left" : "right"}
                  speakerType={dialogue.speaker === "freedom" ? "human" : "robot"}
                  isComplete={true}
                />
              </div>
              {!isLeft && (
                <Avatar
                  type="human"
                  name="Sophie"
                  emoji={dialogue.emoji}
                  position="right"
                  isSpeaking={false}
                  className="flex-shrink-0"
                />
              )}
            </motion.div>
          );
        })}

        {/* Current Message (Typing) */}
        <motion.div
          key={currentLineIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`flex gap-3 ${currentLine.speaker === "traditional" ? "justify-start" : "justify-end"}`}
        >
          {currentLine.speaker === "traditional" && (
            <Avatar
              type="robot"
              name="Alex"
              emoji={currentLine.emoji}
              position="left"
              isSpeaking={true}
              className="flex-shrink-0"
            />
          )}
          <div className={`max-w-[70%] ${currentLine.speaker === "traditional" ? "" : "flex flex-col items-end"}`}>
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
          {currentLine.speaker === "freedom" && (
            <Avatar
              type="human"
              name="Sophie"
              emoji={currentLine.emoji}
              position="right"
              isSpeaking={true}
              className="flex-shrink-0"
            />
          )}
        </motion.div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4 pt-4 border-t">
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
