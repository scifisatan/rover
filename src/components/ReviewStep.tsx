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
      <h2 className="text-2xl font-bold">Review Your Information</h2>

      {/* Basic Info Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Basic Information</CardTitle>
          <Button variant="ghost" onClick={() => onEdit("basic")}>Edit</Button>
        </CardHeader>
        <CardContent className="space-y-2">
          <p><strong>Business Name:</strong> {formData.basic?.business_name}</p>
          <p><strong>Tagline:</strong> {formData.basic?.tagline || "Not provided"}</p>
          <p><strong>Description:</strong> {formData.basic?.description || "Not provided"}</p>
        </CardContent>
      </Card>

      {/* Features Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Features</h3>
          <Button variant="ghost" onClick={() => onEdit("features")}>Edit</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {formData.features?.features?.map((feature, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          )) || <p className="text-muted-foreground">No features added</p>}
        </div>
      </div>

      {/* Team Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Team Members</h3>
          <Button variant="ghost" onClick={() => onEdit("team")}>Edit</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {formData.team?.members?.map((member, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-3">
                  {member.image_url && (
                    <img 
                      src={member.image_url} 
                      alt={member.name} 
                      className="h-24 w-24 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <h4 className="font-semibold text-lg">{member.name}</h4>
                    <p className="text-muted-foreground">{member.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )) || <p className="text-muted-foreground">No team members added</p>}
        </div>
      </div>

      {/* Gallery Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Gallery</h3>
          <Button variant="ghost" onClick={() => onEdit("gallery")}>Edit</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {formData.gallery?.images?.map((image, index) => (
            <Card key={index}>
              <CardContent className="p-2">
                <img 
                  src={image.image_url} 
                  alt={image.caption || `Gallery image ${index + 1}`}
                  className="w-full aspect-video object-cover rounded-md"
                />
                {image.caption && (
                  <p className="mt-2 text-sm text-center text-muted-foreground">
                    {image.caption}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Contact Information Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Contact Information</CardTitle>
          <Button variant="ghost" onClick={() => onEdit("contact")}>Edit</Button>
        </CardHeader>
        <CardContent className="space-y-2">
          <p><strong>Email:</strong> {formData.contact?.contact_email || "Not provided"}</p>
          <p><strong>Phone:</strong> {formData.contact?.contact_phone || "Not provided"}</p>
          <p><strong>Address:</strong> {formData.contact?.address || "Not provided"}</p>
        </CardContent>
      </Card>

      {/* Social Media Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Social Media</CardTitle>
          <Button variant="ghost" onClick={() => onEdit("social")}>Edit</Button>
        </CardHeader>
        <CardContent className="space-y-2">
          {Object.entries(formData.social || {}).map(([platform, url]) => (
            url && <p key={platform}><strong>{platform.split('_')[0].toUpperCase()}:</strong> {url as string}</p>
          ))}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={() => onEdit("basic")}>
          Make Changes
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={isSubmitting}
          className="min-w-[150px]"
        >
          {isSubmitting ? "Creating..." : "Create Website"}
        </Button>
      </div>
    </div>
  )
}
