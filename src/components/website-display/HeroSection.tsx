// HeroSection.tsx
"use client"

import { FC } from "react"
import { motion } from "framer-motion"

interface HeroSectionProps {
  businessName: string
  tagline?: string
  description?: string
}

export const HeroSection: FC<HeroSectionProps> = ({ businessName, tagline, description }) => {
  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-b from-[#0F172A] to-[#1E293B] overflow-hidden">
      <div className="container mx-auto px-4 relative z-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-bold tracking-tighter bg-gradient-to-r from-white via-purple-300 to-pink-300 bg-clip-text text-transparent"
          >
            {businessName}
          </motion.h1>

          {tagline && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl md:text-3xl text-gray-300 font-light max-w-2xl mx-auto leading-relaxed"
            >
              {tagline}
            </motion.p>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex justify-center gap-4 mt-12 flex-wrap"
          >
            
          </motion.div>
        </div>
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 z-10 opacity-30">
        <motion.div
          animate={{ x: [-100, 0, 100], y: [0, 100, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ x: [100, 0, -100], y: [100, 0, 100] }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute w-64 h-64 bg-pink-500/20 rounded-full blur-3xl"
        />
      </div>
    </section>
  )
}