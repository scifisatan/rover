
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { BasicInfoStep } from "./steps/BasicInfoStep";
import { ContactStep } from "./steps/ContactStep";
import { FeaturesStep } from "./steps/FeaturesStep";
import { GalleryStep } from "./steps/GalleryStep";
import { SocialMediaStep } from "./steps/SocialMediaStep";
import { TeamStep } from "./steps/TeamStep";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const STEPS = ["basic", "features", "team", "gallery", "contact", "social"] as const;
type Step = (typeof STEPS)[number];

export const CreateWebsiteForm = () => {
  const [currentStep, setCurrentStep] = useState<Step>("basic");
  const [websiteId, setWebsiteId] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const currentStepIndex = STEPS.indexOf(currentStep);
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === STEPS.length - 1;

  const goToNextStep = () => {
    if (!isLastStep) {
      setCurrentStep(STEPS[currentStepIndex + 1]);
    }
  };

  const goToPreviousStep = () => {
    if (!isFirstStep) {
      setCurrentStep(STEPS[currentStepIndex - 1]);
    }
  };

  const onStepComplete = async (stepData: any) => {
    try {
      if (currentStep === "basic" && !websiteId) {
        const { data: website, error } = await supabase
          .from("websites")
          .insert([stepData])
          .select()
          .single();

        if (error) throw error;
        setWebsiteId(website.id);
        toast({
          title: "Website created!",
          description: "Now let's add some features to your website.",
        });
      } else {
        switch (currentStep) {
          case "features":
            const { error: featuresError } = await supabase
              .from("website_features")
              .insert(
                stepData.features.map((feature: any) => ({
                  ...feature,
                  website_id: websiteId,
                }))
              );
            if (featuresError) throw featuresError;
            break;

          case "team":
            const { error: teamError } = await supabase
              .from("website_team_members")
              .insert(
                stepData.members.map((member: any) => ({
                  ...member,
                  website_id: websiteId,
                }))
              );
            if (teamError) throw teamError;
            break;

          case "gallery":
            const { error: galleryError } = await supabase
              .from("website_gallery_images")
              .insert(
                stepData.images.map((image: any) => ({
                  ...image,
                  website_id: websiteId,
                }))
              );
            if (galleryError) throw galleryError;
            break;

          case "contact":
          case "social":
            const { error: updateError } = await supabase
              .from("websites")
              .update(stepData)
              .eq("id", websiteId);
            if (updateError) throw updateError;
            break;
        }
      }

      if (isLastStep) {
        toast({
          title: "Website completed!",
          description: "Your website has been created successfully.",
        });
        navigate("/app");
      } else {
        goToNextStep();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto p-6">
      <Tabs value={currentStep} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <BasicInfoStep onComplete={onStepComplete} />
        </TabsContent>

        <TabsContent value="features">
          <FeaturesStep onComplete={onStepComplete} />
        </TabsContent>

        <TabsContent value="team">
          <TeamStep onComplete={onStepComplete} />
        </TabsContent>

        <TabsContent value="gallery">
          <GalleryStep onComplete={onStepComplete} />
        </TabsContent>

        <TabsContent value="contact">
          <ContactStep onComplete={onStepComplete} />
        </TabsContent>

        <TabsContent value="social">
          <SocialMediaStep onComplete={onStepComplete} />
        </TabsContent>
      </Tabs>

      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={goToPreviousStep}
          disabled={isFirstStep}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>

        <Button
          variant="outline"
          onClick={goToNextStep}
          disabled={isLastStep || !websiteId}
        >
          Next
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};
