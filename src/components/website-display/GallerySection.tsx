// GallerySection.tsx
"use client"

import { FC } from "react"
import { motion } from "framer-motion"

interface GalleryImage {
  image_url: string
  caption?: string
}

interface GallerySectionProps {
  images: GalleryImage[]
}

export const GallerySection: FC<GallerySectionProps> = ({ images }) => {
  return (
    <section className="py-20 bg-gradient-to-b from-[#0F172A] to-[#1E293B]">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold mb-16 text-center bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent"
        >
          Gallery
        </motion.h2>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {images.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative group overflow-hidden rounded-xl transform hover:z-10 hover:scale-[1.02] transition-all"
            >
              <img
                src={image.image_url}
                alt={image.caption || "Gallery image"}
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {image.caption && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <motion.p
                    initial={{ y: 20 }}
                    whileInView={{ y: 0 }}
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