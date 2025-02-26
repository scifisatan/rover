import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Loader2, Plus, Trash2 } from "lucide-react"
import QRCode from "react-qr-code"
import {
  LineChart,
  Line,
  XAxis, 
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreateWebsiteForm } from "@/components/website-form/steps/CreateWebsiteForm"
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth"
import { supabase } from "@/integrations/supabase/client"
import { useQuery, useMutation } from "@tanstack/react-query"
import { AnimatedBackground } from "@/components/ui/animated-background"
import { ChatbotUI } from "@/components/ChatbotUI"
import { FiUsers, FiEye, FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from "react-icons/fi"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Settings, LogOut } from "lucide-react"

const DashboardComponent = () => {
  const [activeTab, setActiveTab] = useState("websites")
  const [isCreating, setIsCreating] = useState(false)
  const { user } = useSupabaseAuth()
  const navigate = useNavigate()
  const [showQR, setShowQR] = useState<string | null>(null)

  const handleGenerateQR = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setShowQR(id)
  }

  const handleDownloadQR = (id: string, businessName: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const svg = document.getElementById(`QRCode-${id}`)
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg)
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      const img = new Image()
      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        ctx?.drawImage(img, 0, 0)
        const pngFile = canvas.toDataURL("image/png")
        const downloadLink = document.createElement("a")
        downloadLink.download = `${businessName}-qr`
        downloadLink.href = pngFile
        downloadLink.click()
      }
      img.src = "data:image/svg+xml;base64," + btoa(svgData)
    }
  }

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

  const deleteWebsite = useMutation({
    mutationFn: async (websiteId: string) => {
      
      const { error:deleteError } = await supabase
        .from('websites')
        .delete()
        .eq('id', websiteId)

    

      if (deleteError ) {
        console.error('Error deleting website and related data:', deleteError);
        throw new Error('Failed to delete website and its data'); 
      }
    },
    onSuccess: () => {
      refetch();
    },
    onError: (error) => {
      console.error('Error during deletion:', error);
      alert('Failed to delete website and its data. Please try again.');
    }
  });

  const handleDeleteWebsite = async (websiteId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this website?")) {
      deleteWebsite.mutate(websiteId);
    }
  };

  const analyticsData = [
    { name: "Jan", visitors: 4000, pageViews: 2400, facebook: 1200, instagram: 800, linkedin: 600, twitter: 400 },
    { name: "Feb", visitors: 3000, pageViews: 1398, facebook: 1100, instagram: 700, linkedin: 500, twitter: 300 },
    { name: "Mar", visitors: 2000, pageViews: 9800, facebook: 1000, instagram: 600, linkedin: 400, twitter: 200 },
    { name: "Apr", visitors: 2780, pageViews: 3908, facebook: 900, instagram: 500, linkedin: 300, twitter: 100 },
    { name: "May", visitors: 1890, pageViews: 4800, facebook: 800, instagram: 400, linkedin: 200, twitter: 50 },
    { name: "Jun", visitors: 2390, pageViews: 3800, facebook: 700, instagram: 300, linkedin: 100, twitter: 25 },
    { name: "Jul", visitors: 3490, pageViews: 4300, facebook: 600, instagram: 200, linkedin: 50, twitter: 10 },
    { name: "Aug", visitors: 2000, pageViews: 6000, facebook: 500, instagram: 100, linkedin: 25, twitter: 5 },
  ]

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"]

  const SOCIAL_METRICS = [
    { name: 'Facebook', key: 'facebook', color: '#4267B2', icon: <FiFacebook /> },
    { name: 'Instagram', key: 'instagram', color: '#E1306C', icon: <FiInstagram /> },
    { name: 'LinkedIn', key: 'linkedin', color: '#0077B5', icon: <FiLinkedin /> },
    { name: 'Twitter', key: 'twitter', color: '#1DA1F2', icon: <FiTwitter /> }
  ];

  if (isCreating) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <AnimatedBackground />
        <div className="relative z-10 p-8">
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
          <Card className="bg-white/[0.06] border-white/[0.12] backdrop-blur-md shadow-xl">
            <CardContent className="p-6">
              <CreateWebsiteForm
                onFormCompletion={() => {
                  setIsCreating(false)
                  refetch()
                }}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />
      <div className="relative z-10 p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <div className="flex space-x-4">
            <Button
              onClick={() => setIsCreating(true)}
              className="bg-white/10 text-white border border-white/20 hover:bg-white/20"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Website
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full bg-white/10 hover:bg-white/20">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.user_metadata?.avatar_url} />
                    <AvatarFallback className="bg-primary/20 text-primary">
                      {user?.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-white/10 backdrop-blur-lg border-white/20 text-white" align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user?.user_metadata?.full_name || 'User'}</p>
                    <p className="text-xs text-white/70 truncate">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/20" />
                <DropdownMenuItem className="hover:bg-white/10 focus:bg-white/20 cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-white/10 focus:bg-white/20 cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/20" />
                <DropdownMenuItem 
                  className="hover:bg-red-500/10 focus:bg-red-500/20 cursor-pointer text-red-400 hover:text-red-300"
                  onClick={() => { supabase.auth.signOut(); navigate("/") }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 text-white">
          <TabsList className="bg-white/[0.06] border-white/[0.12] backdrop-blur-md">
            <TabsTrigger value="websites" className="text-white data-[state=active]:bg-white/10">
              Websites
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-white data-[state=active]:bg-white/10">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="chatbot" className="text-white data-[state=active]:bg-white/10">
              Chatbot
            </TabsTrigger>
          </TabsList>

          <TabsContent value="websites" className="space-y-6">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="bg-white/[0.06] border-white/[0.12] backdrop-blur-md shadow-xl animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-white/10 rounded w-2/3"></div>
                    <div className="h-4 bg-white/10 rounded w-1/2 mt-2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-20 bg-white/10 rounded"></div>
                  </CardContent>
                </Card>
              </div>
            ) : websites && websites.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {websites.map((website) => (
                  <Card
                    key={website.id}
                    onClick={() => navigate(`/${website.business_name}`)}
                    className="bg-white/[0.06] border-white/[0.12] backdrop-blur-md shadow-xl 
                      hover:bg-white/[0.08] transition-all cursor-pointer group"
                  >
                    {showQR === website.id ? (
                      <CardContent className="p-6">
                        <div className="flex flex-col items-center space-y-4">
                          <div className="bg-white p-4 rounded-xl">
                            <QRCode
                              id={`QRCode-${website.id}`}
                              value={`${window.location.origin}/${website.business_name}`}
                              size={200}
                            />
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              onClick={(e) => handleDownloadQR(website.id, website.business_name, e)}
                              className="text-white bg-white/10 hover:bg-white/20"
                            >
                              Download QR
                            </Button>
                            <Button
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation()
                                setShowQR(null)
                              }}
                              className="text-white bg-white/10 hover:bg-white/20"
                            >
                              Close
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    ) : (
                      <>
                        <CardHeader>
                          <CardTitle className="text-xl text-white group-hover:text-white/90 transition-colors">
                            {website.business_name}
                          </CardTitle>
                          {website.tagline && (
                            <CardDescription className="text-white/70 group-hover:text-white/80">
                              {website.tagline}
                            </CardDescription>
                          )}
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {website.description && (
                            <p className="text-white/60 group-hover:text-white/70">
                              {website.description}
                            </p>
                          )}
                          <div className="flex justify-between items-center pt-4 border-t border-white/10">
                            <Button
                              variant="ghost"
                              className="text-white/70 hover:text-white hover:bg-white/10"
                              onClick={(e) => handleGenerateQR(website.id, e)}
                            >
                              View QR Code
                            </Button>
                            <Button
                              variant="ghost"
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                              onClick={(e) => handleDeleteWebsite(website.id, e)}
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </Button>
                          </div>
                        </CardContent>
                      </>
                    )}
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-white/[0.06] border-white/[0.12] backdrop-blur-md shadow-xl text-center p-8">
                <CardHeader>
                  <CardTitle className="text-xl text-white">Create Your First Website</CardTitle>
                  <CardDescription className="text-white/70">
                    Get started by creating your first business website
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => setIsCreating(true)}
                    className="bg-white/10 text-white border border-white/20 hover:bg-white/20"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create Website
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {websites?.map((website) => (
              <Card key={website.id} className="bg-white/[0.06] border-white/[0.12] backdrop-blur-md shadow-xl">
                <CardHeader>
                  <CardTitle className="text-white">{website.business_name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Line Chart */}
                    <div className="col-span-1 h-[400px] text-white">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={analyticsData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                          <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                          <YAxis stroke="rgba(255,255,255,0.5)" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "rgba(0,0,0,0.8)",
                              border: "1px solid rgba(255,255,255,0.2)",
                              borderRadius: "8px",
                              color: "white",
                            }}
                          />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="visitors"
                            stroke="#8884d8"
                            strokeWidth={2}
                            dot={{ stroke: "#8884d8", strokeWidth: 2 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="pageViews"
                            stroke="#82ca9d"
                            strokeWidth={2}
                            dot={{ stroke: "#82ca9d", strokeWidth: 2 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    
                    {/* Bar Chart */}
                    <div className="col-span-1 h-[400px] text-white">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analyticsData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                          <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                          <YAxis stroke="rgba(255,255,255,0.5)" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "rgba(0,0,0,0.8)",
                              border: "1px solid rgba(255,255,255,0.2)",
                              borderRadius: "8px",
                              color: "white",
                            }}
                          />
                          <Legend />
                          <Bar dataKey="facebook" fill="#8884d8" />
                          <Bar dataKey="instagram" fill="#82ca9d" />
                          <Bar dataKey="linkedin" fill="#ffc658" />
                          <Bar dataKey="twitter" fill="#ff8042" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Pie Chart with Legend */}
                    <div className="col-span-1 h-[400px] text-white flex flex-col">
                      <div className="flex-1">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={SOCIAL_METRICS.map(metric => ({
                                name: metric.name,
                                value: analyticsData[analyticsData.length - 1][metric.key]
                              }))}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {SOCIAL_METRICS.map((metric, index) => (
                                <Cell 
                                  key={`cell-${index}`} 
                                  fill={metric.color}
                                  strokeWidth={2}
                                  stroke="rgba(255,255,255,0.1)"
                                />
                              ))}
                            </Pie>
                            <Tooltip
                              content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                  const data = payload[0].payload;
                                  return (
                                    <div className="bg-black/80 backdrop-blur-sm border border-white/10 p-3 rounded-lg shadow-xl">
                                      <p className="text-white font-semibold">{data.name}</p>
                                      <p className="text-white/80">
                                        {data.value.toLocaleString()} interactions
                                      </p>
                                    </div>
                                  );
                                }
                                return null;
                              }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      {/* Legend below pie chart */}
                      <div className="mt-4 space-y-2">
                        {SOCIAL_METRICS.map((metric) => (
                          <div 
                            key={metric.name}
                            className="flex items-center gap-2 text-sm hover:bg-white/5 p-2 rounded-lg transition-colors"
                          >
                            <div className="flex items-center gap-2 min-w-[24px]">
                              <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: metric.color }}
                              />
                              {metric.icon}
                            </div>
                            <span className="flex-1">{metric.name}</span>
                            <span className="font-mono opacity-80">
                              {analyticsData[analyticsData.length - 1][metric.key].toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="chatbot" className="space-y-6">
            <Card className="bg-white/[0.06] border-white/[0.12] backdrop-blur-md shadow-xl">
              <CardHeader>
                <CardTitle className="text-white">AI Business Assistant</CardTitle>
                <CardDescription className="text-white/70">
                  Ask me anything about improving your business performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChatbotUI businessData={{
                  websites,
                  analyticsData,
                  // Add any other relevant business data here
                }} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}


const Dashboard = () => {
  const navigate = useNavigate()
  const { user, loading } = useSupabaseAuth()
  if (loading) return (
    <>
      <AnimatedBackground />
      <Loader2 className="text-black" />
    </>
  )
  if (!user) {
    navigate("/auth")
  }
  return (
    <DashboardComponent />
  )

}

export default Dashboard
