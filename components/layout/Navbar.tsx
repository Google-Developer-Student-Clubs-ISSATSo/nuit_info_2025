'use client'

import Link from 'next/link'
import { XPBar } from './XPBar'
import { Button } from '../ui/button'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Clapperboard, Github, Heart } from 'lucide-react'

export function Navbar() {
  const pathname = usePathname()
  const isLanding = pathname === '/'

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="border-border/40 bg-background/60 fixed top-0 right-0 left-0 z-50 border-b backdrop-blur-xl backdrop-saturate-150"
    >
      <div className="container mx-auto flex h-18 items-center justify-between px-6">
        <Link
          href="/"
          className="group flex items-center gap-3 text-xl font-bold"
        >
          <span className="text-2xl transition-transform group-hover:scale-110">
            🚀
          </span>
          <span className="bg-gradient-to-r from-sky-500 via-blue-600 to-purple-600 bg-clip-text font-extrabold text-transparent">
            NIRD 2025
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild className="gap-2">
            <Link
              href="/donate"
              className="flex items-center justify-center gap-2"
            >
              <Heart className="h-4 w-4" />
              <span className="hidden sm:inline">Faire un don</span>
            </Link>
          </Button>
          {!isLanding && <XPBar />}
          <Button variant="ghost" size="sm" asChild className="gap-2">
            <Link
              href="https://github.com/Google-Developer-Student-Clubs-ISSATSo/nuit_info_2025"
              target="_blank"
              className="flex flex-col items-center justify-center"
            >
              <Github className="h-4 w-4" />
              <span className="hidden sm:inline">GitHub</span>
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild className="gap-2">
            <Link
              href="/movie"
              className="flex flex-col items-center justify-center"
            >
              <Clapperboard className="h-4 w-4" />
              <span className="hidden sm:inline">Movie</span>
            </Link>
          </Button>
        </div>
      </div>
    </motion.header>
  )
}
