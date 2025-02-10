
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { HeroSection } from "@/components/website-display/HeroSection";
import { ContactSection } from "@/components/website-display/ContactSection";
import { FeaturesSection } from "@/components/website-display/FeaturesSection";
import { TeamSection } from "@/components/website-display/TeamSection";
import { GallerySection } from "@/components/website-display/GallerySection";
import { SocialMediaSection } from "@/components/website-display/SocialMediaSection";

const WebsiteDisplay = () => {
  const { businessName } = useParams();

  const { data: website, isLoading } = useQuery({
    queryKey: ["website", businessName],
    queryFn: async () => {
      const { data: websiteData, error: websiteError } = await supabase
        .from("websites")
        .select(`
          *,
          website_features (
            id,
            title,
            description,
            display_order
          ),
          website_team_members (
            id,
            name,
            role,
            image_url,
            display_order
          ),
          website_gallery_images (
            id,
            image_url,
            caption,
            display_order
          )
        `)
        .ilike('business_name', businessName!)
        .maybeSingle();

      if (websiteError) throw websiteError;
      if (!websiteData) throw new Error("Website not found");
      return websiteData;
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-8">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (!website) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold">Website not found</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/5">
      <HeroSection
        businessName={website.business_name}
        tagline={website.tagline}
        description={website.description}
      />
      <ContactSection
        email={website.contact_email}
        phone={website.contact_phone}
        address={website.address}
      />
      <FeaturesSection features={website.website_features} />
      <TeamSection members={website.website_team_members} />
      <GallerySection images={website.website_gallery_images} />
      <SocialMediaSection
        facebookUrl={website.facebook_url}
        twitterUrl={website.twitter_url}
        instagramUrl={website.instagram_url}
        linkedinUrl={website.linkedin_url}
      />
    </div>
  );
};

export default WebsiteDisplay;
