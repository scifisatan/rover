// FeaturesSection.tsx
"use client"

import { FC } from "react"
import { motion } from "framer-motion"
import { FiCheckCircle } from "react-icons/fi"

interface Feature {
  title: string
  description: string
  icon: string
}

interface FeaturesSectionProps {
  features: Feature[]
}

export const FeaturesSection: FC<FeaturesSectionProps> = ({ features }) => {
  return (
    <section className="py-20 bg-gradient-to-b from-[#1E293B] to-[#0F172A]">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold mb-16 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
        >
          Why Choose Us
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-8 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10 hover:border-purple-400/30 transition-all group"
            >
              <div className="mb-6">
                <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <FiCheckCircle className="text-2xl text-purple-400" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              <div className="mt-6 pt-4 border-t border-white/10 group-hover:border-purple-400/20 transition-colors">
                <span className="text-purple-400 hover:text-purple-300 cursor-pointer transition-colors">
                  Learn more →
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}