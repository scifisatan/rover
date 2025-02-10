import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useState } from "react"

export const ReviewStep = ({ formData, onEdit, onSubmit }) => {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
      await onSubmit()
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-8">Review Your Information</h2>

      {/* Basic Info Card */}
      <Card className="bg-white/[0.06] border-white/[0.12] backdrop-blur-md shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white text-xl">Basic Information</CardTitle>
          <Button variant="ghost" onClick={() => onEdit("basic")} className="text-white hover:bg-white/20">Edit</Button>
        </CardHeader>
        <CardContent className="space-y-3 text-white/90 text-[1.05rem]">
          <p><span className="text-white font-semibold">Business Name:</span> {formData.basic?.business_name}</p>
          <p><span className="text-white font-semibold">Tagline:</span> {formData.basic?.tagline || "Not provided"}</p>
          <p><span className="text-white font-semibold">Description:</span> {formData.basic?.description || "Not provided"}</p>
        </CardContent>
      </Card>

      {/* Features Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-semibold text-white">Features</h3>
          <Button variant="ghost" onClick={() => onEdit("features")} className="text-white hover:bg-white/20">Edit</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {formData.features?.features?.map((feature, index) => (
            <Card key={index} className="bg-white/[0.06] border-white/[0.12] backdrop-blur-md shadow-xl hover:bg-white/[0.08] transition-all">
              <CardHeader>
                <CardTitle className="text-lg text-white">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/90 text-[1.05rem]">{feature.description}</p>
              </CardContent>
            </Card>
          )) || <p className="text-white/80 text-lg">No features added</p>}
        </div>
      </div>

      {/* Team Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">Team Members</h3>
          <Button variant="ghost" onClick={() => onEdit("team")} className="text-white hover:bg-white/10">Edit</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {formData.team?.members?.map((member, index) => (
            <Card key={index} className="bg-white/[0.06] border-white/[0.12] backdrop-blur-md shadow-xl hover:bg-white/[0.08] transition-all">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  {member.image_url && (
                    <div className="ring-2 ring-white/30 rounded-full p-1">
                      <img 
                        src={member.image_url} 
                        alt={member.name} 
                        className="h-28 w-28 rounded-full object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <h4 className="font-semibold text-xl text-white mb-1">{member.name}</h4>
                    <p className="text-white/90 text-[1.05rem]">{member.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )) || <p className="text-white/80 text-lg">No team members added</p>}
        </div>
      </div>

      {/* Gallery Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">Gallery</h3>
          <Button variant="ghost" onClick={() => onEdit("gallery")} className="text-white hover:bg-white/10">Edit</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {formData.gallery?.images?.map((image, index) => (
            <Card key={index} className="bg-white/[0.06] border-white/[0.12] backdrop-blur-md shadow-xl overflow-hidden">
              <CardContent className="p-2">
                <img 
                  src={image.image_url} 
                  alt={image.caption || `Gallery image ${index + 1}`}
                  className="w-full aspect-video object-cover rounded-md"
                />
                {image.caption && (
                  <p className="mt-2 text-sm text-center text-white/70">
                    {image.caption}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
  
      {/* Contact Information Card */}
      <Card className="bg-white/[0.06] border-white/[0.12] backdrop-blur-md shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">Contact Information</CardTitle>
          <Button variant="ghost" onClick={() => onEdit("contact")} className="text-white hover:bg-white/20">Edit</Button>
        </CardHeader>
        <CardContent className="space-y-3 text-white/90 text-[1.05rem]">
          <p><span className="text-white font-semibold">Email:</span> {formData.contact?.contact_email || "Not provided"}</p>
          <p><span className="text-white font-semibold">Phone:</span> {formData.contact?.contact_phone || "Not provided"}</p>
          <p><span className="text-white font-semibold">Address:</span> {formData.contact?.address || "Not provided"}</p>
        </CardContent>
      </Card>

      {/* Social Media Card */}
      <Card className="bg-white/[0.06] border-white/[0.12] backdrop-blur-md shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">Social Media</CardTitle>
          <Button variant="ghost" onClick={() => onEdit("social")} className="text-white hover:bg-white/20">Edit</Button>
        </CardHeader>
        <CardContent className="space-y-3 text-white/90 text-[1.05rem]">
          {Object.entries(formData.social || {}).map(([platform, url]) => (
            url && <p key={platform}>
              <span className="text-white font-semibold">{platform.split('_')[0].toUpperCase()}:</span> {url as string}
            </p>
          ))}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4 mt-8">
        <Button 
          variant="outline" 
          onClick={() => onEdit("basic")}
          className="bg-white/[0.08] text-white border-white/30 hover:bg-white/[0.15] text-lg px-6 py-5"
        >
          Make Changes
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={isSubmitting}
          className="min-w-[150px] bg-white/[0.15] text-white border border-white/30 hover:bg-white/[0.25] text-lg px-6 py-5"
        >
          {isSubmitting ? "Creating..." : "Create Website"}
        </Button>
      </div>
    </div>
  )
}
