"use client"

import React from "react"
import { motion } from "framer-motion"

const generateBlobs = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    initialX: Math.random() * 100,
    initialY: Math.random() * 100,
    size: 200 + Math.random() * 200,
    hue: 220 + Math.random() * 60,
    opacity: 0.1 + Math.random() * 0.3,
    // Faster duration range (10-25 seconds instead of 20-60)
    duration: 10 + Math.random() * 15,
    // Add movement range for more dynamic motion
    moveRange: 25 + Math.random() * 15,
  }))
}

export const AnimatedBackground: React.FC = () => {
  const blobs = React.useMemo(() => generateBlobs(8), []) // Increased blob count for more activity

  return (
    <div className="fixed inset-0 bg-[#130025] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/30 via-black/50 to-purple-800/30" />

      {blobs.map((blob) => (
        <motion.div
          key={blob.id}
          className="absolute rounded-full mix-blend-screen filter blur-3xl"
          initial={{
            x: `${blob.initialX}%`,
            y: `${blob.initialY}%`,
            scale: 1,
          }}
          animate={{
            x: [
              `${blob.initialX}%`,
              `${(blob.initialX + blob.moveRange) % 100}%`,
              `${blob.initialX}%`
            ],
            y: [
              `${blob.initialY}%`,
              `${(blob.initialY + blob.moveRange) % 100}%`,
              `${blob.initialY}%`
            ],
            scale: [1, 1.2, 1], // Increased scale range
          }}
          transition={{
            duration: blob.duration,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            // Add different timing for each animation property
            times: [0, 0.5, 1],
          }}
          style={{
            width: `${blob.size}px`,
            height: `${blob.size}px`,
            background: `radial-gradient(circle at center, 
              hsla(${blob.hue}, 70%, 60%, ${blob.opacity}) 0%, 
              transparent 70%
            )`,
            zIndex: 0,
          }}
        />
      ))}

      {/* Faster noise animation */}
      <div 
        className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none"
        style={{
          animation: 'noise 4s steps(5) infinite' // Reduced from 8s to 4s
        }}
      />
    </div>
  )
}

