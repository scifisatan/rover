"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import QRCode from "react-qr-code"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data for sites and analytics
const sites = [
  {
    id: 1,
    title: "My Blog",
    description: "Personal blog about tech",
    logo: "/placeholder.svg",
    url: "https://myblog.com",
  },
  {
    id: 2,
    title: "Portfolio",
    description: "Showcase of my work",
    logo: "/placeholder.svg",
    url: "https://myportfolio.com",
  },
  { id: 3, title: "E-commerce", description: "Online store", logo: "/placeholder.svg", url: "https://mystore.com" },
  // Add more sites as needed
]

const analyticsData = [
  { name: "Jan", visitors: 4000, pageViews: 2400 },
  { name: "Feb", visitors: 3000, pageViews: 1398 },
  { name: "Mar", visitors: 2000, pageViews: 9800 },
  { name: "Apr", visitors: 2780, pageViews: 3908 },
  { name: "May", visitors: 1890, pageViews: 4800 },
  { name: "Jun", visitors: 2390, pageViews: 3800 },
]

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("sites")
  const [showQR, setShowQR] = useState<number | null>(null)
  const router = useRouter()

  const handleSiteClick = (url: string) => {
    router.push(url)
  }

  const handleGenerateQR = (id: number) => {
    setShowQR(id)
  }

  const handleDownloadQR = (id: number, url: string) => {
    const svg = document.getElementById(`QRCode-${id}`)
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg)
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      const img = new window.Image(200, 200)
      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        ctx?.drawImage(img, 0, 0)
        const pngFile = canvas.toDataURL("image/png")
        const downloadLink = document.createElement("a")
        downloadLink.download = "QRCode"
        downloadLink.href = pngFile
        downloadLink.click()
      }
      img.src = "data:image/svg+xml;base64," + btoa(svgData)
    }
  }

  return (
    <div className="container mx-auto p-4 h-screen">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 h-full">
        <TabsList>
          <TabsTrigger value="sites">Sites</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="sites" className="space-y-4 h-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Your Sites</h2>
            <Link href="/form">
              <Button>Create New Site</Button>
            </Link>
          </div>
          <div className="flex flex-col space-y-4 overflow-y-auto h-full pb-4">
            {sites.map((site) => (
              <Card
                key={site.id}
                className="flex-shrink-0 w-full cursor-pointer hover:shadow-lg transition-shadow duration-300"
              >
                <CardContent className="p-4">
                  {showQR === site.id ? (
                    <div className="flex flex-col items-center">
                      <QRCode id={`QRCode-${site.id}`} value={site.url} size={200} />
                      <p className="mt-2 text-sm text-center">Click to download QR Code</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownloadQR(site.id, site.url)}
                      >
                        Download QR
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowQR(null)}
                      >
                        Close QR
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-start mb-2">
                        <Image
                          src={site.logo || "/placeholder.svg"}
                          alt={site.title}
                          width={40}
                          height={40}
                          className="rounded"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleGenerateQR(site.id)
                          }}
                        >
                          Generate QR
                        </Button>
                      </div>
                      <div onClick={() => handleSiteClick(site.url)}>
                        <h3 className="font-semibold mb-1">{site.title}</h3>
                        <p className="text-sm text-gray-600">{site.description}</p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="h-full">
          <h2 className="text-2xl font-semibold mb-4">Site Analytics</h2>
          <div className="space-y-8">
            {sites.map((site) => (
              <Card key={site.id}>
                <CardContent className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{site.title}</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={analyticsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="visitors" stroke="#8884d8" activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="pageViews" stroke="#82ca9d" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

