
// import { FC } from "react";
// import { Mail, MapPin, Phone } from "lucide-react";

// interface ContactSectionProps {
//   email?: string;
//   phone?: string;
//   address?: string;
// }

// export const ContactSection: FC<ContactSectionProps> = ({ email, phone, address }) => {
//   if (!email && !phone && !address) return null;

//   return (
//     <section className="py-16 bg-gradient-to-r from-secondary/10 via-secondary/5 to-secondary/10">
//       <div className="container mx-auto px-4">
//         <h2 className="text-3xl font-semibold mb-12 text-center">Get in Touch</h2>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
//           {email && (
//             <a
//               href={`mailto:${email}`}
//               className="group flex flex-col items-center p-6 rounded-xl bg-card/50 hover:bg-card/80 transition-all duration-300 hover:shadow-lg"
//             >
//               <Mail className="h-8 w-8 mb-4 text-primary/80 group-hover:text-primary transition-colors" />
//               <span className="text-muted-foreground group-hover:text-foreground transition-colors">
//                 {email}
//               </span>
//             </a>
//           )}
//           {phone && (
//             <a
//               href={`tel:${phone}`}
//               className="group flex flex-col items-center p-6 rounded-xl bg-card/50 hover:bg-card/80 transition-all duration-300 hover:shadow-lg"
//             >
//               <Phone className="h-8 w-8 mb-4 text-primary/80 group-hover:text-primary transition-colors" />
//               <span className="text-muted-foreground group-hover:text-foreground transition-colors">
//                 {phone}
//               </span>
//             </a>
//           )}
//           {address && (
//             <div className="group flex flex-col items-center p-6 rounded-xl bg-card/50 hover:bg-card/80 transition-all duration-300 hover:shadow-lg">
//               <MapPin className="h-8 w-8 mb-4 text-primary/80 group-hover:text-primary transition-colors" />
//               <span className="text-muted-foreground group-hover:text-foreground transition-colors text-center">
//                 {address}
//               </span>
//             </div>
//           )}
//         </div>
//       </div>
//     </section>
//   );
// };


"use client"

import type { FC } from "react"
import { motion } from "framer-motion"
import { Mail, MapPin, Phone } from "lucide-react"

interface ContactSectionProps {
  email?: string
  phone?: string
  address?: string
}

export const ContactSection: FC<ContactSectionProps> = ({ email, phone, address }) => {
  if (!email && !phone && !address) return null

  const contactItems = [
    email && {
      icon: Mail,
      content: email,
      href: `mailto:${email}`,
      delay: 0.2,
    },
    phone && {
      icon: Phone,
      content: phone,
      href: `tel:${phone}`,
      delay: 0.3,
    },
    address && {
      icon: MapPin,
      content: address,
      href: `https://maps.google.com/?q=${encodeURIComponent(address)}`,
      delay: 0.4,
    },
  ].filter(Boolean)

  return (
    <section className="py-16 bg-[#0F172A]">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl font-semibold mb-12 text-center text-white"
        >
          Get in Touch
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {contactItems.map((item, index) => (
            <motion.a
              key={index}
              href={item.href}
              target={item.icon === MapPin ? "_blank" : undefined}
              rel={item.icon === MapPin ? "noopener noreferrer" : undefined}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: item.delay }}
              viewport={{ once: true }}
              className="group flex flex-col items-center p-6 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300"
            >
              <item.icon className="h-8 w-8 mb-4 text-pink-500 group-hover:scale-110 transition-transform" />
              <span className="text-gray-300 group-hover:text-white transition-colors text-center">{item.content}</span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}

