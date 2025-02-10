import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { BasicInfoStep } from "./../../BasicInfoStep"
import { FeaturesStep } from "./../../FeaturesStep"
import { TeamStep } from "./../../TeamStep"
import { GalleryStep } from "./../../GalleryStep"
import { ContactStep } from "./../../ContactStep"
import { SocialMediaStep } from "./../../SocialMediaStep"
import { ReviewStep } from "./../../ReviewStep"
import { motion } from "framer-motion"
import { AnimatedBackground } from "@/components/ui/animated-background"
 
const STEPS = ["basic", "features", "team", "gallery", "contact", "social", "review"] as const
type Step = (typeof STEPS)[number]
 
export const CreateWebsiteForm = ({ onFormCompletion }) => {
  const [currentStep, setCurrentStep] = useState<Step>("basic")
  const [formData, setFormData] = useState({
    basic: null,
    features: null,
    team: null,
    gallery: null,
    contact: null,
    social: null,
  })
  const { toast } = useToast()

  const currentStepIndex = STEPS.indexOf(currentStep)
  const isFirstStep = currentStepIndex === 0
  const isLastStep = currentStepIndex === STEPS.length - 1

  const goToNextStep = () => {
    if (!isLastStep) {
      setCurrentStep(STEPS[currentStepIndex + 1])
    }
  }

  const goToPreviousStep = () => {
    if (!isFirstStep) {
      setCurrentStep(STEPS[currentStepIndex - 1])
    }
  }

  const onStepComplete = (stepData: any) => {
    // Store raw form data without additional processing
    setFormData(prev => ({
      ...prev,
      [currentStep]: stepData
    }));
  }

  const handleFinalSubmit = async () => {
    try {
      // Submit basic info first
      const { data: website, error } = await supabase
        .from("websites")
        .insert([formData.basic])
        .select()
        .single()

      if (error) throw error
      const websiteId = website.id

      // Submit other data - ensure arrays are properly structured
      await Promise.all([
        supabase.from("website_features").upsert(
          formData.features?.features?.map((f: any) => ({ ...f, website_id: websiteId })) || []
        ),
        supabase.from("website_team_members").upsert(
          formData.team?.members?.map((t: any) => ({ ...t, website_id: websiteId })) || []
        ),
        supabase.from("website_gallery_images").upsert(
          formData.gallery?.images?.map((g: any) => ({ ...g, website_id: websiteId })) || []
        ),
        supabase.from("websites").update({
          ...formData.contact,
          ...formData.social,
        }).eq('id', websiteId)
      ])

      onFormCompletion()
      toast({
        title: "Success!",
        description: "Your website has been created successfully.",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const getTableName = (step: Step): "website_features" | "websites" | "website_gallery_images" | "website_team_members" => {
    switch (step) {
      case "features":
        return "website_features"
      case "team":
        return "website_team_members"
      case "gallery":
        return "website_gallery_images"
      case "contact":
      case "social":
      default:
        return "websites"
    }
  }

  const renderStepContent = () => {
    if (currentStep === "review") {
      return <ReviewStep 
        formData={formData} 
        onEdit={setCurrentStep}
        onSubmit={handleFinalSubmit}
      />
    }

    const stepProps = {
      onComplete: onStepComplete,
      initialData: formData[currentStep]
    };

    const steps = {
      basic: <BasicInfoStep {...stepProps} />,
      features: <FeaturesStep {...stepProps} />,
      team: <TeamStep {...stepProps} />,
      gallery: <GalleryStep {...stepProps} />,
      contact: <ContactStep {...stepProps} />,
      social: <SocialMediaStep {...stepProps} />
    };

    return steps[currentStep];
  }

  return (
    <div className="relative min-h-screen w-full">
      <AnimatedBackground />
      
      {/* Form Container with enhanced glass effect */}
      <div className="relative z-10 min-h-screen py-8 px-4">
        <Card className="max-w-5xl mx-auto bg-white/[0.02] border-white/[0.05] shadow-2xl 
          backdrop-blur-xl rounded-xl overflow-hidden
          before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/[0.08] before:to-transparent before:pointer-events-none
          hover:border-white/[0.08] transition-all duration-500">
          <Tabs value={currentStep} className="w-full">
            <TabsList className="grid w-full grid-cols-7 bg-black/40 border-b border-white/[0.08]
              backdrop-blur-sm">
              {STEPS.map((step) => (
                <TabsTrigger 
                  key={step} 
                  value={step}
                  className="text-white/60 transition-all duration-200 
                    data-[state=active]:text-white 
                    data-[state=active]:bg-white/[0.08]
                    data-[state=active]:shadow-[inset_0_0_20px_rgba(255,255,255,0.05)]
                    hover:text-white/90 hover:bg-white/[0.04]"
                >
                  {step.charAt(0).toUpperCase() + step.slice(1)}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value={currentStep} className="p-8 relative z-10">{renderStepContent()}</TabsContent>
          </Tabs>

          {currentStep !== "review" && (
            <div className="flex justify-between px-8 pb-8">
              <Button 
                variant="outline" 
                onClick={goToPreviousStep} 
                disabled={isFirstStep}
                className="bg-white/[0.03] text-white border-white/10 
                  hover:bg-white/[0.08] hover:border-white/20 
                  transition-all duration-300
                  disabled:opacity-50 disabled:cursor-not-allowed
                  shadow-[0_0_15px_rgba(255,255,255,0.05)]"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              <Button 
                variant="outline" 
                onClick={goToNextStep} 
                disabled={isLastStep}
                className="bg-white/[0.03] text-white border-white/10 
                  hover:bg-white/[0.08] hover:border-white/20
                  transition-all duration-300
                  disabled:opacity-50 disabled:cursor-not-allowed
                  shadow-[0_0_15px_rgba(255,255,255,0.05)]"
              >
                {currentStep === "social" ? "Complete" : (
                  <>Next <ChevronRight className="ml-2 h-4 w-4" /></>
                )}
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

