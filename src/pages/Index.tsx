import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Star, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Marquee } from "@/components/ui/marquee"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth"

function ElegantShape({ className, delay = 0, width = 400, height = 100, rotate = 0, gradient = "from-white/[0.08]" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -150, rotate: rotate - 15 }}
      animate={{ opacity: 1, y: 0, rotate: rotate }}
      transition={{ duration: 2.4, delay, ease: [0.23, 0.86, 0.39, 0.96], opacity: { duration: 1.2 } }}
      className={cn("absolute", className)}
    >
      <motion.div
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 12, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        style={{ width, height }}
        className="relative"
      >
        <div
          className={cn(
            "absolute inset-0 rounded-full",
            "bg-gradient-to-r to-transparent",
            gradient,
            "backdrop-blur-[2px] border-2 border-white/[0.15]",
            "shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]",
            "after:absolute after:inset-0 after:rounded-full",
            "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]",
          )}
        />
      </motion.div>
    </motion.div>
  )
}

function FeatureCard({ title, description, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.4, 0.25, 1] }}
      className="relative"
    >
      <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm">
        <div className="flex flex-col gap-4">
          <h3 className="text-xl font-semibold text-white/90">{title}</h3>
          <p className="text-white/60 leading-relaxed">{description}</p>
        </div>
      </div>
    </motion.div>
  )
}

function Testimonial({ name, role, quote }) {
  return (
    <div className="bg-white/[0.03] border border-white/[0.08] rounded-lg p-6 backdrop-blur-sm">
      <div className="flex items-center mb-4">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
        ))}
      </div>
      <p className="text-white/80 mb-4 italic">"{quote}"</p>
      <div className="text-white/60">
        <p className="font-semibold">{name}</p>
        <p className="text-sm">{role}</p>
      </div>
    </div>
  )
}

function WebsiteGallery() {
  const websites = [
    { type: "Restaurant", image: "/placeholder.svg?height=300&width=400" },
    { type: "E-commerce", image: "/placeholder.svg?height=300&width=400" },
    { type: "Portfolio", image: "/placeholder.svg?height=300&width=400" },
    { type: "Blog", image: "/placeholder.svg?height=300&width=400" },
    { type: "Fitness Studio", image: "/placeholder.svg?height=300&width=400" },
  ]
  return (
    <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-black md:shadow-xl">
      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-10 text-center">Our Templates</h2>

      <Marquee className="[--duration:20s]">
        {websites.map((website, index) => (
          <div key={index} className="flex-shrink-0 snap-center">
            <img
              src={website.image || "/placeholder.svg"}
              alt={website.type}
              width={300}
              height={225}
              className="rounded-lg object-cover"
            />
            <p className="text-white mt-2 text-center text-sm sm:text-base">{website.type}</p>
          </div>
        ))}
      </Marquee>
    </div>
  );
}




function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate();
  const { user } = useSupabaseAuth();

  useEffect(() => {
    const closeMenu = () => setIsOpen(false)
    window.addEventListener("resize", closeMenu)
    return () => window.removeEventListener("resize", closeMenu)
  }, [])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="text-white font-bold text-xl">WebCraft</div>
          <div className="hidden md:flex space-x-4">

            {user ? (
              <Button variant="outline" onClick={() => { navigate('/app') }} className="text-black bg-white border-white/20">
                Dashboard
              </Button>
            ) : (
              <Button variant="outline" onClick={() => { navigate('/auth') }} className="text-black bg-white border-white/20">
                Login
              </Button>
            )}

          </div>
          <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Button variant="ghost" className="text-white w-full justify-start">
              Features
            </Button>
            <Button variant="ghost" className="text-white w-full justify-start">
              Templates
            </Button>
            <Button variant="ghost" className="text-white w-full justify-start">
              Pricing
            </Button>
            <Button variant="outline" className="text-white border-white/20 w-full justify-start">
              Login
            </Button>
          </div>
        </div>
      )}
    </nav>
  )
}

export default function BusinessWebsiteBuilder() {
  const navigate = useNavigate()
  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 1, delay: 0.5 + i * 0.2, ease: [0.25, 0.4, 0.25, 1] },
    }),
  }

  return (
    <div className="relative bg-[#030303]">
      <Navbar />

      <motion.div className="min-h-screen flex flex-col justify-center overflow-hidden py-20 lg:py-0">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.05] via-transparent to-rose-500/[0.05] blur-3xl" />

        <div className="absolute inset-0 overflow-hidden">
          <ElegantShape
            delay={0.3}
            width={600}
            height={140}
            rotate={12}
            gradient="from-indigo-500/[0.15]"
            className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
          />
          <ElegantShape
            delay={0.5}
            width={500}
            height={120}
            rotate={-15}
            gradient="from-rose-500/[0.15]"
            className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
          />
          <ElegantShape
            delay={0.4}
            width={300}
            height={80}
            rotate={-8}
            gradient="from-violet-500/[0.15]"
            className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
          />
          <ElegantShape
            delay={0.6}
            width={200}
            height={60}
            rotate={20}
            gradient="from-amber-500/[0.15]"
            className="right-[15%] md:right-[20%] top-[10%] md:top-[15%]"
          />
          <ElegantShape
            delay={0.7}
            width={150}
            height={40}
            rotate={-25}
            gradient="from-cyan-500/[0.15]"
            className="left-[20%] md:left-[25%] top-[5%] md:top-[10%]"
          />
        </div>

        <div className="relative z-10 container mx-auto px-4 md:px-6 flex flex-col justify-between h-full">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div custom={1} variants={fadeUpVariants} initial="hidden" animate="visible">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 tracking-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80">
                  Create Your Business
                </span>
                <br className="hidden sm:block" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">
                  Website in Minutes
                </span>
              </h1>
            </motion.div>

            <motion.div custom={2} variants={fadeUpVariants} initial="hidden" animate="visible">
              <p className="text-base sm:text-lg md:text-xl text-white/60 mb-6 sm:mb-8 leading-relaxed max-w-3xl mx-auto px-4 sm:px-0">
                Professional websites made simple. Answer a few questions about your business, and we'll create a
                stunning website tailored just for you.
              </p>
            </motion.div>

            <motion.div custom={3} variants={fadeUpVariants} initial="hidden" animate="visible">
              <Button onClick={() => { navigate('/auth') }} className="bg-white/10 hover:bg-white/15 text-white border border-white/20">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto mt-12 sm:mt-16 px-4 sm:px-0"
          >
            <FeatureCard
              title="Easy Setup"
              description="Answer a simple questionnaire about your business and watch your website come to life instantly."
              delay={1.2}
            />
            <FeatureCard
              title="Professional Design"
              description="Get a beautifully designed website that reflects your brand and engages your customers."
              delay={1.4}
            />
            <FeatureCard
              title="Full Control"
              description="Easily manage and update your website content through an intuitive dashboard."
              delay={1.6}
            />
          </motion.div>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 md:px-6 py-24">
        <WebsiteGallery />

        <div className="mt-20 px-4 sm:px-0">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-10 text-center">What Our Customers Say</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Testimonial
              name="Sarah Johnson"
              role="Small Business Owner"
              quote="WebCraft made creating my business website a breeze. I'm impressed with how professional it looks!"
            />
            <Testimonial
              name="Mike Chen"
              role="Freelance Designer"
              quote="The templates are modern and sleek. It's perfect for showcasing my portfolio to potential clients."
            />
            <Testimonial
              name="Emily Rodriguez"
              role="Restaurant Manager"
              quote="Our new website has significantly increased our online reservations. Thank you, WebCraft!"
            />
          </div>
        </div>
      </div>

      <footer className="bg-black/30 backdrop-blur-md text-white/60 py-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-bold mb-4">WebCraft</h3>
              <p className="text-sm sm:text-base">Creating stunning websites for businesses of all sizes.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-sm sm:text-base">
                <li>Easy Setup</li>
                <li>Professional Design</li>
                <li>Full Control</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm sm:text-base">
                <li>Blog</li>
                <li>Tutorials</li>
                <li>Support</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm sm:text-base">
                <li>About Us</li>
                <li>Careers</li>
                <li>Contact</li>
              </ul>
            </div>
          </div>
          <div className="mt-10 pt-8 border-t border-white/10 text-center">
            <p className="text-sm sm:text-base">&copy; 2025 WebCraft. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
