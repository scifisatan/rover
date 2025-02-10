
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CreateWebsiteForm } from "@/components/website-form/CreateWebsiteForm"
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth"
import { supabase } from "@/integrations/supabase/client"
import { useQuery } from "@tanstack/react-query"

const Dashboard = () => {
  const [isCreating, setIsCreating] = useState(false)
  const { user } = useSupabaseAuth()
  const navigate = useNavigate()

  const {
    data: websites,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["websites", user?.id],
    queryFn: async () => {
      if (!user?.id) return []
      const { data, error } = await supabase
        .from("websites")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) throw error
      return data
    },
    enabled: !!user?.id,
  })

  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: [0.23, 0.86, 0.39, 0.96],
      },
    }),
  }

  if (isCreating) {
    return (
      <div className="min-h-screen bg-[#030303] p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.05] via-transparent to-rose-500/[0.05] blur-3xl" />
        <div className="container mx-auto relative z-10">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">Create Your Website</h1>
            <Button
              variant="outline"
              onClick={() => setIsCreating(false)}
              className="bg-white/10 text-white border-white/20 hover:bg-white/20"
            >
              Cancel
            </Button>
          </div>
          <Card className="bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm text-white">
            <CardContent>
              <CreateWebsiteForm onFormCompletion={setIsCreating} />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#030303] p-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.05] via-transparent to-rose-500/[0.05] blur-3xl" />
      <div className="container mx-auto relative z-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Your Websites</h1>
          <Button
            onClick={() => setIsCreating(true)}
            className="bg-white/10 text-white border border-white/20 hover:bg-white/20"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Website
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <Card className="bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm text-white">
              <CardHeader>
                <CardTitle>Loading...</CardTitle>
              </CardHeader>
            </Card>
          ) : websites && websites.length > 0 ? (
            websites.map((website, index) => (
              <motion.div
                key={website.id}
                variants={fadeInUpVariants}
                initial="hidden"
                animate="visible"
                custom={index}
              >
                <Card
                  onClick={() => {
                    navigate("/" + website.business_name)
                  }}
                  className="bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm text-white hover:bg-white/[0.05] transition-all cursor-pointer"
                >
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">
                      {website.business_name}
                    </CardTitle>
                    {website.tagline && <CardDescription className="text-white/60">{website.tagline}</CardDescription>}
                  </CardHeader>
                  <CardContent>
                    {website.description && <p className="text-sm text-white/60 mb-4">{website.description}</p>}
                    <div className="space-y-2 text-white/80">
                      {website.contact_email && <p className="text-sm">Email: {website.contact_email}</p>}
                      {website.contact_phone && <p className="text-sm">Phone: {website.contact_phone}</p>}
                      {website.address && <p className="text-sm">Address: {website.address}</p>}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <Card className="bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm text-white col-span-full">
              <CardHeader>
                <CardTitle className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">
                  Create Your First Website
                </CardTitle>
                <CardDescription className="text-white/60">
                  Get started by creating your first business website
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full bg-white/10 text-white border-white/20 hover:bg-white/20"
                  onClick={() => setIsCreating(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Website
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard

