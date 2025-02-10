"use client";

import { FC, useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

interface HeroSectionProps {
  businessName: string;
  tagline?: string;
  description?: string;
}

export const HeroSection: FC<HeroSectionProps> = ({ businessName, tagline, description }) => {
  const [backgroundImage, setBackgroundImage] = useState<string>("");

  useEffect(() => {
    const fetchBackgroundImage = async () => {
      try {
        const response = await axios.get("https://api.unsplash.com/photos/random", {
          params: {
            query: `${businessName}`,
            client_id: "rfJ0_iegWXQXwubV2B8FdikuoKZV3faIMG2jeyjSoWw",
          },
        });
        setBackgroundImage(response.data.urls.regular);
      } catch (error) {
        console.error("Error fetching background image:", error);
      }
    };

    fetchBackgroundImage();
  }, [businessName, tagline]);

  return (
    <section className="relative overflow-hidden py-24 sm:py-32 bg-[#0F172A]">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-r from-white via-pink-500 to-purple-500 bg-clip-text text-transparent"
          >
            {businessName}
          </motion.h1>

          {tagline && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-2xl text-gray-300 font-light"
            >
              {tagline}
            </motion.p>
          )}

          {description && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-lg text-gray-400/80 leading-relaxed max-w-2xl mx-auto"
            >
              {description}
            </motion.p>
          )}
        </div>
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0F172A]/90" />
    </section>
  );
};

