"use client"

import type { FC } from "react"
import { motion } from "framer-motion"
import { ArrowUpRight, Facebook, Instagram, Linkedin, Twitter } from "lucide-react"

interface SocialMediaSectionProps {
  facebookUrl?: string
  twitterUrl?: string
  instagramUrl?: string
  linkedinUrl?: string
}

export const SocialMediaSection: FC<SocialMediaSectionProps> = ({
  facebookUrl,
  twitterUrl,
  instagramUrl,
  linkedinUrl,
}) => {
  if (!facebookUrl && !twitterUrl && !instagramUrl && !linkedinUrl) return null

  const socialLinks = [
    facebookUrl && {
      name: "Facebook",
      url: facebookUrl,
      icon: Facebook,
      color: "#1877F2",
      delay: 0.1,
    },
    twitterUrl && {
      name: "Twitter",
      url: twitterUrl,
      icon: Twitter,
      color: "#1DA1F2",
      delay: 0.2,
    },
    instagramUrl && {
      name: "Instagram",
      url: instagramUrl,
      icon: Instagram,
      color: "#E4405F",
      delay: 0.3,
    },
    linkedinUrl && {
      name: "LinkedIn",
      url: linkedinUrl,
      icon: Linkedin,
      color: "#0A66C2",
      delay: 0.4,
    },
  ].filter(Boolean)

  return (
    <section className="py-20 bg-gradient-to-b from-[#1E293B] to-[#0F172A]">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl font-semibold mb-12 text-center text-white"
        >
          Connect With Us
        </motion.h2>

        <div className="flex flex-wrap justify-center gap-4">
          {socialLinks.map((social, index) => (
            <motion.a
              key={index}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: social.delay }}
              viewport={{ once: true }}
              className="group flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 transition-all duration-300"
              style={{
                boxShadow: `0 0 0 1px rgba(255, 255, 255, 0.1)`,
              }}
            >
              <social.icon className="h-5 w-5" style={{ color: social.color }} />
              <span className="text-gray-300 group-hover:text-white transition-colors">{social.name}</span>
              <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-white group-hover:-translate-y-1 group-hover:translate-x-1 transition-all" />
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}

