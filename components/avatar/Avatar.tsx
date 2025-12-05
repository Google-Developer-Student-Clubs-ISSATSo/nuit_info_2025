"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface AvatarProps {
  type: "human" | "robot";
  position: "left" | "right";
  name?: string;
  emoji?: string;
  isSpeaking?: boolean;
  className?: string;
}

export function Avatar({ type, position, name, emoji, isSpeaking, className }: AvatarProps) {
  // Default emojis based on type
  const defaultEmoji = type === "human" ? "👩‍🏫" : "👨‍💼";
  const displayEmoji = emoji || defaultEmoji;

  return (
    <motion.div
      animate={{
        scale: isSpeaking ? 1.05 : 1,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn(
        "relative flex flex-col items-center gap-2",
        className
      )}
    >
      {/* Avatar Circle with Emoji */}
      <div
        className={cn(
          "w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center text-4xl md:text-5xl shadow-lg transition-all duration-300",
          type === "human" 
            ? "bg-gradient-to-br from-emerald-400 to-teal-500 ring-emerald-300" 
            : "bg-gradient-to-br from-slate-400 to-slate-600 ring-slate-300",
          isSpeaking && "ring-4 ring-offset-2 ring-offset-background shadow-xl"
        )}
      >
        <span className="drop-shadow-md">{displayEmoji}</span>
      </div>

      {/* Speaking Indicator */}
      {isSpeaking && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex gap-1"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.15 }}
              className={cn(
                "w-2 h-2 rounded-full",
                type === "human" ? "bg-emerald-500" : "bg-slate-500"
              )}
            />
          ))}
        </motion.div>
      )}

      {/* Name Badge */}
      {name && (
        <span className={cn(
          "text-xs font-semibold px-3 py-1 rounded-full",
          type === "human" 
            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" 
            : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
        )}>
          {name}
        </span>
      )}
    </motion.div>
  );
}

interface DialogueBoxProps {
  text: string;
  position: "left" | "right";
  speakerType?: "human" | "robot";
  isComplete?: boolean;
  onComplete?: () => void;
}

export function DialogueBox({ text, position, speakerType = "human", isComplete = false, onComplete }: DialogueBoxProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTypingDone, setIsTypingDone] = useState(false);

  useEffect(() => {
    // Reset state when text changes
    setDisplayedText("");
    setIsTypingDone(false);

    if (isComplete) {
      setDisplayedText(text);
      setIsTypingDone(true);
      onComplete?.();
      return;
    }

    let currentIndex = 0;
    
    const typeNextChar = () => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsTypingDone(true);
        onComplete?.();
      }
    };

    // Type first character immediately
    typeNextChar();

    // Continue typing remaining characters
    const interval = setInterval(() => {
      if (currentIndex >= text.length) {
        clearInterval(interval);
        return;
      }
      typeNextChar();
    }, 30);

    return () => clearInterval(interval);
  }, [text, isComplete]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={cn(
        "w-full max-w-md p-5 rounded-2xl shadow-lg relative backdrop-blur-sm",
        speakerType === "human" 
          ? "bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50 border border-emerald-200/50 dark:border-emerald-700/50" 
          : "bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-900/70 dark:to-gray-900/70 border border-slate-200/50 dark:border-slate-700/50",
        position === "left" ? "rounded-tl-sm" : "rounded-tr-sm"
      )}
    >
      <p className="text-sm md:text-base leading-relaxed text-foreground/90 break-words whitespace-pre-wrap">
        {displayedText}
        {!isTypingDone && (
          <span className="inline-block w-0.5 h-4 ml-0.5 bg-current animate-pulse align-middle" />
        )}
      </p>
    </motion.div>
  );
}
