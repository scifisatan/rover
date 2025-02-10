// ContactSection.tsx
"use client"

import { FC } from "react"
import { motion } from "framer-motion"
import { FiMapPin, FiMail, FiPhone } from "react-icons/fi"

interface ContactSectionProps {
  address?: string
  email?: string
  phone?: string
  latitude?: number
  longitude?: number
}

export const ContactSection: FC<ContactSectionProps> = ({
  address,
  email,
  phone,
  latitude,
  longitude
}) => {
  const handleMapRedirect = () => {
    if (latitude && longitude) {
      window.open(`https://www.google.com/maps?q=${latitude},${longitude}`, '_blank');
    }
  };

  if (!email && !phone && !address) return null

  return (
    <section className="relative py-24 bg-gradient-to-b from-[#0F172A] to-[#1E293B]">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          {email && (
            <motion.div
              whileHover={{ y: -5 }}
              className="p-8 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 hover:border-white/20 transition-all"
            >
              <FiMail className="text-4xl text-purple-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Email</h3>
              <a href={`mailto:${email}`} className="text-gray-300 hover:text-purple-300 transition-colors">
                {email}
              </a>
            </motion.div>
          )}
          
          {phone && (
            <motion.div
              whileHover={{ y: -5 }}
              className="p-8 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 hover:border-white/20 transition-all"
            >
              <FiPhone className="text-4xl text-pink-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Phone</h3>
              <a href={`tel:${phone}`} className="text-gray-300 hover:text-pink-300 transition-colors">
                {phone}
              </a>
            </motion.div>
          )}

          {(address || (latitude && longitude)) && (
            <motion.div
              whileHover={{ y: -5 }}
              className="p-8 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 hover:border-white/20 transition-all"
            >
              <FiMapPin className="text-4xl text-cyan-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Address</h3>
              <p className="text-gray-300 mb-3">{address}</p>
              {latitude && longitude && (
                <button
                  onClick={handleMapRedirect}
                  className="text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-2"
                >
                  View on Google Maps
                  <FiMapPin className="text-sm" />
                </button>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  )
}