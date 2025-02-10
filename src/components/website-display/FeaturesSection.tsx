"use client"

import type { FC } from "react"
import { motion } from "framer-motion"

interface Feature {
  id: number
  title: string
  description?: string
  display_order: number
}

interface FeaturesSectionProps {
  features: Feature[]
}

export const FeaturesSection: FC<FeaturesSectionProps> = ({ features }) => {
  if (!features || features.length === 0) return null

  return (
    <section className="py-20 bg-[#0F172A]">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl font-semibold mb-12 text-center text-white"
        >
          What We Offer
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features
            .sort((a, b) => a.display_order - b.display_order)
            .map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group p-6 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300"
              >
                <div className="relative">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "2rem" }}
                    transition={{ duration: 0.3, delay: index * 0.1 + 0.3 }}
                    className="h-1 bg-gradient-to-r from-pink-500 to-purple-500 mb-4"
                  />
                  <h3 className="text-xl font-medium mb-3 text-white group-hover:text-pink-400 transition-colors">
                    {feature.title}
                  </h3>
                  {feature.description && (
                    <p className="text-gray-400 group-hover:text-gray-300 transition-colors">{feature.description}</p>
                  )}
                </div>
              </motion.div>
            ))}
        </div>
      </div>
    </section>
  )
}

