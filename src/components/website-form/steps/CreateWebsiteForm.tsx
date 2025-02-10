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
    <Card className="w-full max-w-4xl mx-auto p-6">
      <Tabs value={currentStep} className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          {STEPS.map((step) => (
            <TabsTrigger key={step} value={step}>
              {step.charAt(0).toUpperCase() + step.slice(1)}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value={currentStep}>{renderStepContent()}</TabsContent>
      </Tabs>

      {currentStep !== "review" && (
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={goToPreviousStep} disabled={isFirstStep}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          <Button 
            variant="outline" 
            onClick={goToNextStep} 
            disabled={isLastStep}
          >
            {currentStep === "social" ? (
              "Complete"
            ) : (
              <>
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      )}
    </Card>
  )
}

