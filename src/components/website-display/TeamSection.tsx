"use client"

import type { FC } from "react"
import { motion } from "framer-motion"

interface TeamMember {
  id: number
  name: string
  role: string
  image_url?: string
  display_order: number
}

interface TeamSectionProps {
  members: TeamMember[]
}

export const TeamSection: FC<TeamSectionProps> = ({ members }) => {
  if (!members || members.length === 0) return null

  return (
    <section className="py-20 bg-gradient-to-b from-[#0F172A] to-[#1E293B]">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl font-semibold mb-12 text-center text-white"
        >
          Meet Our Team
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {members
            .sort((a, b) => a.display_order - b.display_order)
            .map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group text-center"
              >
                {member.image_url && (
                  <div className="relative mb-6 mx-auto w-48 h-48">
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 transform rotate-6 group-hover:rotate-12 transition-transform duration-300" />
                    <div className="absolute inset-0 rounded-xl overflow-hidden">
                      <img
                        src={member.image_url || "/placeholder.svg"}
                        alt={member.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                  </div>
                )}
                <h3 className="font-medium text-xl text-white group-hover:text-pink-400 transition-colors">
                  {member.name}
                </h3>
                <p className="text-gray-400 mt-2">{member.role}</p>
              </motion.div>
            ))}
        </div>
      </div>
    </section>
  )
}

