'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useState } from 'react'

interface AvatarProps {
  type: 'human' | 'robot'
  position: 'left' | 'right'
  name?: string
  emoji?: string
  isSpeaking?: boolean
  className?: string
}

export function Avatar({ type, name, isSpeaking, className }: AvatarProps) {
  // Determine which avatar image to use
  const avatarImage =
    type === 'human' ? '/avatars/sophie.png' : '/avatars/alex.png'
  const avatarName = type === 'human' ? 'Sophie' : 'Alex'

  return (
    <motion.div
      animate={{
        scale: isSpeaking ? 1.05 : 1,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={cn('relative flex flex-col items-center gap-2', className)}
    >
      {/* Avatar Circle with Image */}
      <div
        className={cn(
          'bg-background relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full shadow-lg transition-all duration-300 md:h-24 md:w-24',
          isSpeaking && 'ring-offset-background shadow-xl ring-4 ring-offset-2',
        )}
      >
        <Image
          src={avatarImage}
          alt={avatarName}
          width={96}
          height={96}
          className="h-full w-full object-cover"
          priority
        />
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
                'h-2 w-2 rounded-full',
                type === 'human' ? 'bg-emerald-500' : 'bg-slate-500',
              )}
            />
          ))}
        </motion.div>
      )}

      {/* Name Badge */}
      {name && (
        <span
          className={cn(
            'rounded-full px-3 py-1 text-xs font-semibold',
            type === 'human'
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
              : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
          )}
        >
          {name}
        </span>
      )}
    </motion.div>
  )
}

interface DialogueBoxProps {
  text: string
  position: 'left' | 'right'
  speakerType?: 'human' | 'robot'
  isComplete?: boolean
  onComplete?: () => void
}

export function DialogueBox({
  text,
  position,
  speakerType = 'human',
  isComplete = false,
  onComplete,
}: DialogueBoxProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [isTypingDone, setIsTypingDone] = useState(false)

  useEffect(() => {
    // Reset state when text changes
    setDisplayedText('')
    setIsTypingDone(false)

    if (isComplete) {
      setDisplayedText(text)
      setIsTypingDone(true)
      onComplete?.()
      return
    }

    let currentIndex = 0

    const typeNextChar = () => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1))
        currentIndex++
      } else {
        setIsTypingDone(true)
        onComplete?.()
      }
    }

    // Type first character immediately
    typeNextChar()

    // Continue typing remaining characters
    const interval = setInterval(() => {
      if (currentIndex >= text.length) {
        clearInterval(interval)
        return
      }
      typeNextChar()
    }, 30)

    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, isComplete])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={cn(
        'relative w-full max-w-md rounded-2xl p-5 shadow-lg backdrop-blur-sm',
        speakerType === 'human'
          ? 'border border-emerald-200/50 bg-gradient-to-br from-emerald-50 to-teal-50 dark:border-emerald-700/50 dark:from-emerald-950/50 dark:to-teal-950/50'
          : 'border border-slate-200/50 bg-gradient-to-br from-slate-50 to-gray-50 dark:border-slate-700/50 dark:from-slate-900/70 dark:to-gray-900/70',
        position === 'left' ? 'rounded-tl-sm' : 'rounded-tr-sm',
      )}
    >
      <p className="text-foreground/90 text-sm leading-relaxed break-words whitespace-pre-wrap md:text-base">
        {displayedText}
        {!isTypingDone && (
          <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-current align-middle" />
        )}
      </p>
    </motion.div>
  )
}
