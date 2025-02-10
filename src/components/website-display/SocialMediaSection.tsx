// SocialMediaSection.tsx
"use client"

import { FC } from "react"
import { motion } from "framer-motion"
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from "react-icons/fi"

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
  linkedinUrl
}) => {
  return (
    <section className="py-20 bg-gradient-to-b from-[#1E293B] to-[#0F172A]">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="max-w-2xl mx-auto text-center"
        >
          <h2 className="text-2xl font-semibold text-white mb-8">
            Connect With Us
          </h2>
          <div className="flex justify-center gap-6">
            {facebookUrl && (
              <motion.a
                whileHover={{ scale: 1.1 }}
                href={facebookUrl}
                className="p-4 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10 hover:border-blue-500/50 transition-all"
              >
                <FiFacebook className="text-3xl text-blue-400" />
              </motion.a>
            )}
            {twitterUrl && (
              <motion.a
                whileHover={{ scale: 1.1 }}
                href={twitterUrl}
                className="p-4 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10 hover:border-sky-500/50 transition-all"
              >
                <FiTwitter className="text-3xl text-sky-400" />
              </motion.a>
            )}
            {instagramUrl && (
              <motion.a
                whileHover={{ scale: 1.1 }}
                href={instagramUrl}
                className="p-4 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10 hover:border-pink-500/50 transition-all"
              >
                <FiInstagram className="text-3xl text-pink-400" />
              </motion.a>
            )}
            {linkedinUrl && (
              <motion.a
                whileHover={{ scale: 1.1 }}
                href={linkedinUrl}
                className="p-4 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10 hover:border-blue-600/50 transition-all"
              >
                <FiLinkedin className="text-3xl text-blue-500" />
              </motion.a>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}