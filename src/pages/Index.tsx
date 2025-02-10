import { useState, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowRight, ChevronLeft, ChevronRight, Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

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
          <div className="h-10 w-10 rounded-lg bg-white/[0.05] flex items-center justify-center border border-white/[0.08]">
            <ArrowRight className="h-5 w-5 text-white/60" />
          </div>
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
  const [currentIndex, setCurrentIndex] = useState(0)
  const scrollRef = useRef(null)

  const websites = [
    { type: "Restaurant", image: "/placeholder.svg?height=300&width=400" },
    { type: "E-commerce", image: "/placeholder.svg?height=300&width=400" },
    { type: "Portfolio", image: "/placeholder.svg?height=300&width=400" },
    { type: "Blog", image: "/placeholder.svg?height=300&width=400" },
    { type: "Fitness Studio", image: "/placeholder.svg?height=300&width=400" },
  ]

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -400 : 400
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" })
    }
  }

  return (
    <div className="relative">
      <h2 className="text-3xl font-bold text-white mb-6">Website Templates</h2>
      <div className="relative overflow-hidden" style={{ width: "100%", height: "350px" }}>
        <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-4" style={{ width: "100%", height: "100%" }}>
          {websites.map((website, index) => (
            <div key={index} className="flex-shrink-0">
              <img
                src={website.image || "/placeholder.svg"}
                alt={website.type}
                width={400}
                height={300}
                className="rounded-lg"
              />
              <p className="text-white mt-2 text-center">{website.type}</p>
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white/10 p-2 rounded-full"
      >
        <ChevronLeft className="text-white" />
      </button>
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/10 p-2 rounded-full"
      >
        <ChevronRight className="text-white" />
      </button>
    </div>
  )
}

export default function BusinessWebsiteBuilder() {
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 200], [1, 0])
  const scale = useTransform(scrollY, [0, 200], [1, 0.8])

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
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-white font-bold text-xl">WebCraft</div>
          <div className="space-x-4">
            <Button variant="ghost" className="text-white">
              Features
            </Button>
            <Button variant="ghost" className="text-white">
              Templates
            </Button>
            <Button variant="ghost" className="text-white">
              Pricing
            </Button>
            <Button variant="outline" className="text-white border-white/20">
              Login
            </Button>
          </div>
        </div>
      </nav>

      <motion.div style={{ opacity, scale }} className="min-h-screen flex flex-col justify-center overflow-hidden">
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

        <div className="relative z-10 container mx-auto px-4 md:px-6 flex flex-col justify-between h-full py-20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div custom={1} variants={fadeUpVariants} initial="hidden" animate="visible">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80">
                  Create Your Business
                </span>
                <br />
                <span
                  className={cn(
                    "bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300",
                  )}
                >
                  Website in Minutes
                </span>
              </h1>
            </motion.div>

            <motion.div custom={2} variants={fadeUpVariants} initial="hidden" animate="visible">
              <p className="text-lg md:text-xl text-white/60 mb-8 leading-relaxed max-w-3xl mx-auto">
                Professional websites made simple. Answer a few questions about your business, and we'll create a
                stunning website tailored just for you.
              </p>
            </motion.div>

            <motion.div custom={3} variants={fadeUpVariants} initial="hidden" animate="visible">
              <Button size="lg" className="bg-white/10 hover:bg-white/15 text-white border border-white/20">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1 }}
              className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto"
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
        </div>
      </motion.div>

      <div className="container mx-auto px-4 md:px-6 py-24">
        <WebsiteGallery />

        <div className="mt-20">
          <h2 className="text-3xl font-bold text-white mb-10 text-center">What Our Customers Say</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
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
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-bold mb-4">WebCraft</h3>
              <p>Creating stunning websites for businesses of all sizes.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Features</h4>
              <ul className="space-y-2">
                <li>Easy Setup</li>
                <li>Professional Design</li>
                <li>Full Control</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li>Blog</li>
                <li>Tutorials</li>
                <li>Support</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li>About Us</li>
                <li>Careers</li>
                <li>Contact</li>
              </ul>
            </div>
          </div>
          <div className="mt-10 pt-8 border-t border-white/10 text-center">
            <p>&copy; 2025 WebCraft. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

