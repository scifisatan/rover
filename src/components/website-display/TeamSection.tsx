// TeamSection.tsx
"use client"

import { FC, useEffect } from "react"
import { motion } from "framer-motion"
import { FiLinkedin, FiTwitter, FiGithub, FiUser } from "react-icons/fi"
import { useState } from "react"
import { supabase } from "@/integrations/supabase/client"

interface TeamMember {
  name: string
  role: string
  bio?: string
  image_url?: string  // Changed from photo to image_url to match database
  socials?: {
    linkedin?: string
    twitter?: string
    github?: string
  }
}

interface TeamSectionProps {
  members: TeamMember[]
}

export const TeamSection: FC<TeamSectionProps> = ({ members }) => {
  const [imageErrors, setImageErrors] = useState<{[key: number]: boolean}>({})
  const [imageUrls, setImageUrls] = useState<{[key: string]: string}>({})

  useEffect(() => {
    const loadImages = async () => {
      const urls: {[key: string]: string} = {}
      
      for (const member of members) {
        if (member.image_url) {  // Changed from photo to image_url
          try {
            // If it's already a full URL, use it directly
            if (member.image_url.startsWith('http')) {
              urls[member.image_url] = member.image_url
              continue
            }

            // Otherwise, try to get it from Supabase storage
            const { data } = supabase
              .storage
              .from('website-images')
              .getPublicUrl(member.image_url)

            if (data?.publicUrl) {
              urls[member.image_url] = data.publicUrl
            }
          } catch (error) {
            console.error('Error loading image:', error)
          }
        }
      }
      
      setImageUrls(urls)
    }

    loadImages()
  }, [members])

  const handleImageError = (index: number) => {
    setImageErrors(prev => ({...prev, [index]: true}))
    console.error(`Image failed to load for member at index ${index}`)
  }

  return (
    <section className="py-20 bg-gradient-to-b from-[#0F172A] to-[#1E293B]">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold mb-16 text-center bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent"
        >
          Our Team
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {members.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10 hover:border-purple-400/30 transition-all group"
            >
              <div className="relative mb-6 overflow-hidden rounded-lg aspect-square bg-gray-800">
                {imageErrors[index] ? (
                  <div className="w-full h-full flex items-center justify-center bg-gray-800">
                    <FiUser className="w-1/3 h-1/3 text-gray-600" />
                  </div>
                ) : (
                  <img
                    src={imageUrls[member.image_url] || member.image_url || '/default-avatar.png'}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={() => handleImageError(index)}
                    loading="lazy"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <p className="text-white text-sm">{member.bio}</p>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-1">{member.name}</h3>
              <p className="text-purple-400 mb-4">{member.role}</p>
              <div className="flex gap-3">
                {member.socials?.linkedin && (
                  <a
                    href={member.socials.linkedin}
                    className="text-white/60 hover:text-blue-400 transition-colors"
                  >
                    <FiLinkedin className="text-xl" />
                  </a>
                )}
                {member.socials?.twitter && (
                  <a
                    href={member.socials.twitter}
                    className="text-white/60 hover:text-sky-400 transition-colors"
                  >
                    <FiTwitter className="text-xl" />
                  </a>
                )}
                {member.socials?.github && (
                  <a
                    href={member.socials.github}
                    className="text-white/60 hover:text-gray-300 transition-colors"
                  >
                    <FiGithub className="text-xl" />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}