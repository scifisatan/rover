"use client"

import type { FC } from "react"
import { motion } from "framer-motion"

interface GalleryImage {
  id: number
  image_url: string
  caption?: string
  display_order: number
}

interface GallerySectionProps {
  images: GalleryImage[]
}

export const GallerySection: FC<GallerySectionProps> = ({ images }) => {
  if (!images || images.length === 0) return null

  return (
    <section className="py-20 bg-[#1E293B]">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl font-semibold mb-12 text-center text-white"
        >
          Gallery
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images
            .sort((a, b) => a.display_order - b.display_order)
            .map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative aspect-square overflow-hidden rounded-xl bg-gray-900/50"
              >
                <img
                  src={image.image_url || "/placeholder.svg"}
                  alt={image.caption || "Gallery image"}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {image.caption && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <motion.p
                      initial={{ y: 20, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="text-white text-lg font-medium"
                    >
                      {image.caption}
                    </motion.p>
                  </div>
                )}
              </motion.div>
            ))}
        </div>
      </div>
    </section>
  )
}

