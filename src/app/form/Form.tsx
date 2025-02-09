"use client"

import { useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { MapPin, Upload, Building, Users, Phone, Facebook, Plus } from "lucide-react"

const steps = [
  { title: "Basic Info", icon: Building },
  { title: "Features", icon: Users },
  { title: "Team", icon: Users },
  { title: "Contact", icon: Phone },
  { title: "Social Media", icon: Facebook },
]

export default function Form() {
  const [currentStep, setCurrentStep] = useState(0)
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm()
  const { fields: featureFields, append: appendFeature } = useFieldArray({
    control,
    name: "features",
  })
  const { fields: teamFields, append: appendTeam } = useFieldArray({
    control,
    name: "team",
  })

  const onSubmit = (data: any) => {
    console.log(data)
    // Here you would typically send the data to your backend
  }

  const setLocation = (location: string) => {
    console.log(`Location set to: ${location}`)
    // Here you would typically update the form state with the location
  }

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0))

  return (
    <Card className="w-full max-w-4xl mx-auto transition-all duration-500 ease-in-out transform hover:scale-[1.01] animate-slide-up">
      <CardContent className="p-6">
        <div className="flex flex-wrap justify-between mb-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex flex-col items-center mb-4 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${
                  index <= currentStep ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {<step.icon className="w-5 h-5" />}
              </div>
              <span className="text-sm mt-2">{step.title}</span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {currentStep === 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Basic Information</h2>
              <div className="space-y-2">
                <Label htmlFor="name">Business Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your business name"
                  {...register("name", { required: "Business name is required" })}
                />
                {errors.name && typeof errors.name.message === "string" && (
                  <p className="text-red-500 text-sm">{errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="tagline">Tagline</Label>
                <Input
                  id="tagline"
                  placeholder="Your business tagline"
                  {...register("tagline", { required: "Tagline is required" })}
                />
                {errors.tagline && typeof errors.tagline.message === "string" && (
                  <p className="text-red-500 text-sm">{errors.tagline.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your business"
                  {...register("description", { required: "Description is required" })}
                />
                {errors.description && typeof errors.description.message === "string" && (
                  <p className="text-red-500 text-sm">{errors.description.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="logo">Logo</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="logo"
                    type="file"
                    className="hidden"
                    {...register("logo", { required: "Logo is required" })}
                  />
                  <Button type="button" onClick={() => document.getElementById("logo")?.click()}>
                    <Upload className="w-4 h-4 mr-2" /> Upload Logo
                  </Button>
                  <span className="text-sm text-muted-foreground">No file chosen</span>
                </div>
                {errors.logo && typeof errors.logo.message === "string" && (
                  <p className="text-red-500 text-sm">{errors.logo.message}</p>
                )}
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Business Features</h2>
              {featureFields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`feature-${index}-title`}>Feature {index + 1} Title</Label>
                    <Input
                      id={`feature-${index}-title`}
                      placeholder={`Feature ${index + 1} Title`}
                      {...register(`features[${index}].title`)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`feature-${index}-description`}>Feature {index + 1} Description</Label>
                    <Input
                      id={`feature-${index}-description`}
                      placeholder={`Feature ${index + 1} Description`}
                      {...register(`features[${index}].description`)}
                    />
                  </div>
                </div>
              ))}
              <Button type="button" onClick={() => appendFeature({ title: "", description: "" })} className="flex items-center">
                <Plus className="w-4 h-4 mr-2" /> Add Feature
              </Button>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Team Members</h2>
              {teamFields.map((field, index) => (
                <div key={field.id} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`team-${index}-image`}>Team Member Image</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id={`team-${index}-image`}
                        type="file"
                        className="hidden"
                        {...register(`team[${index}].image`, { required: "Team member image is required" })}
                      />
                      <Button type="button" onClick={() => document.getElementById(`team-${index}-image`)?.click()}>
                        <Upload className="w-4 h-4 mr-2" /> Upload Image
                      </Button>
                      <span className="text-sm text-muted-foreground">No file chosen</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`team-${index}-name`}>Name</Label>
                    <Input
                      id={`team-${index}-name`}
                      placeholder="Team member name"
                      {...register(`team[${index}].name`, { required: "Team member name is required" })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`team-${index}-designation`}>Designation</Label>
                    <Input
                      id={`team-${index}-designation`}
                      placeholder="Team member designation"
                      {...register(`team[${index}].designation`, { required: "Team member designation is required" })}
                    />
                  </div>
                </div>
              ))}
              <Button type="button" onClick={() => appendTeam({ image: "", name: "", designation: "" })} className="flex items-center">
                <Plus className="w-4 h-4 mr-2" /> Add Team Member
              </Button>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Contact Information</h2>
              <div className="space-y-2">
                <Label htmlFor="contact-phone">Phone Number</Label>
                <Input id="contact-phone" placeholder="Phone Number" {...register("contact.phone")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-email">Email</Label>
                <Input id="contact-email" placeholder="Email" type="email" {...register("contact.email")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-address">Address</Label>
                <Input id="contact-address" placeholder="Address" {...register("contact.address")} />
              </div>
              <div className="space-y-2">
                <Label>Map Location</Label>
                <div className="flex space-x-2">
                  <Button type="button" onClick={() => setLocation("current location")}>
                    <MapPin className="w-4 h-4 mr-2" /> Use Current Location
                  </Button>
                  <Button type="button" variant="outline" onClick={() => alert("Open map selector")}>
                    Choose on Map
                  </Button>
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Social Media</h2>
              <div className="space-y-2">
                <Label htmlFor="social-facebook">Facebook</Label>
                <Input id="social-facebook" placeholder="Facebook profile URL" {...register("social.facebook")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="social-instagram">Instagram</Label>
                <Input id="social-instagram" placeholder="Instagram profile URL" {...register("social.instagram")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="social-whatsapp">WhatsApp</Label>
                <Input id="social-whatsapp" placeholder="WhatsApp number" {...register("social.whatsapp")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="social-viber">Viber</Label>
                <Input id="social-viber" placeholder="Viber number" {...register("social.viber")} />
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8">
            {currentStep > 0 && (
              <Button type="button" onClick={prevStep} variant="outline">
                Previous
              </Button>
            )}
            {currentStep < steps.length - 1 ? (
              <Button type="button" onClick={nextStep} className="ml-auto">
                Next
              </Button>
            ) : (
              <Button type="submit" className="ml-auto">
                Submit
              </Button>
            )}
          </div>
        </form>

        <div className="mt-6 text-center animate-fade-in" style={{ animationDelay: "0.5s" }}>
          <Link href="/" className="text-primary hover:underline transition-colors duration-300">
            Back to Home
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

