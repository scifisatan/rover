"use client"

import React from "react"
import { motion } from "framer-motion"

const generateBlobs = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    initialX: Math.random() * 200 - 50, // Range from -50% to 150%
    initialY: Math.random() * 200 - 50, // Range from -50% to 150%
    size: 150 + Math.random() * 300,
    baseHue: 200 + Math.random() * 40, // Narrower blue range
    opacity: 0.05 + Math.random() * 0.25,
    duration: 15 + Math.random() * 25, // Increased duration for wider movement
    moveRange: 120 + Math.random() * 80, // Even larger movement range
    colorDuration: 8 + Math.random() * 7, // Faster color transitions
    direction: Math.random() > 0.5 ? 1 : -1, // Random direction
  }))
}

export const AnimatedBackground: React.FC = () => {
  const blobs = React.useMemo(() => generateBlobs(12), [])

  return (
    <div className="fixed inset-0 bg-[#130025] overflow-hidden animate-global-hue">
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/30 via-black/50 to-blue-800/30" />
      
      {blobs.map((blob) => (
        <motion.div
          key={blob.id}
          className="absolute rounded-full mix-blend-screen filter blur-3xl"
          initial={{
            x: `${blob.initialX}%`,
            y: `${blob.initialY}%`,
            scale: 0.8,
          }}
          animate={{
            x: [
              `${blob.initialX}%`,
              `${blob.initialX + (blob.moveRange * blob.direction)}%`,
              `${blob.initialX}%`,
              `${blob.initialX - (blob.moveRange * blob.direction)}%`,
              `${blob.initialX}%`
            ],
            y: [
              `${blob.initialY}%`,
              `${blob.initialY + blob.moveRange * 0.5}%`,
              `${blob.initialY - blob.moveRange * 0.5}%`,
              `${blob.initialY + blob.moveRange * 0.5}%`,
              `${blob.initialY}%`
            ],
            scale: [0.8, 1.4, 1.1, 1.4, 0.8],
          }}
          transition={{
            duration: blob.duration,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            times: [0, 0.25, 0.5, 0.75, 1],
          }}
          style={{
            width: `${blob.size}px`,
            height: `${blob.size}px`,
            background: `radial-gradient(circle at center, 
              hsla(${blob.baseHue + Math.sin(Date.now() / (blob.colorDuration * 1000)) * 30}, 
              70%, 
              60%, 
              ${blob.opacity}) 0%, 
              transparent 70%
            )`,
            animation: `colorShift ${blob.colorDuration}s infinite linear`,
            zIndex: 0,
          }}
        />
      ))}

      <div 
        className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none"
        style={{
          animation: 'noise 4s steps(5) infinite'
        }}
      />

      <style>{`
        @keyframes colorShift {
          0% { filter: hue-rotate(0deg); }
          50% { filter: hue-rotate(20deg); }
          100% { filter: hue-rotate(0deg); }
        }

        @keyframes globalHueShift {
          0% { 
            background-color: #130025;
            filter: hue-rotate(0deg);
          }
          33% {
            background-color: #001830;
            filter: hue-rotate(15deg);
          }
          66% {
            background-color: #001840;
            filter: hue-rotate(-15deg);
          }
          100% {
            background-color: #130025;
            filter: hue-rotate(0deg);
          }
        }

        .animate-global-hue {
          animation: globalHueShift 20s infinite;
        }
      `}</style>
    </div>
  )
}

