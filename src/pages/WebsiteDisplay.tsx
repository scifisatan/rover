import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { HeroSection } from "@/components/website-display/HeroSection";
import { ContactSection } from "@/components/website-display/ContactSection";
import { FeaturesSection } from "@/components/website-display/FeaturesSection";
import { TeamSection } from "@/components/website-display/TeamSection";
import { GallerySection } from "@/components/website-display/GallerySection";
import { SocialMediaSection } from "@/components/website-display/SocialMediaSection";

const WebsiteDisplay = () => {
  const { businessName } = useParams();

  // Fetch website data
  const { data: website, isLoading } = useQuery({
    queryKey: ["website", businessName],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("websites")
        .select("*")
        .ilike("business_name", businessName!)
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error("Website not found");
      return data;
    },
  });

  // Mutation to update analytics
  // Mutation to update analytics
  const updateAnalytics = useMutation({
    mutationFn: async () => {
      if (!website?.id) return;

      // First check if analytics row exists
      const { data: existingRow, error: checkError } = await supabase
        .from("analytics")
        .select("website_id")
        .eq("website_id", website.id)
        .maybeSingle();

      if (checkError) {
        console.error("Error checking analytics:", checkError);
        return;
      }

      if (!existingRow) {
        // Create new row if it doesn't exist
        const { error: insertError } = await supabase
          .from("analytics")
          .insert([
            {
              website_id: website.id,
              visitors: 1,
              facebook_click_count: 0,
              twitter_click_count: 0,
              instagram_click_count: 0,
              linkedin_click_count: 0
            }
          ]);

        if (insertError) {
          console.error("Error creating analytics:", insertError);
          return;
        }
      } else {
        // Update existing row
        const { data: currentData, error: fetchError } = await supabase
          .from("analytics")
          .select("visitors")
          .eq("website_id", website.id)
          .single();

        if (fetchError) {
          console.error("Error fetching current visitors:", fetchError);
          return;
        }

        const { error: updateError } = await supabase
          .from("analytics")
          .update({ visitors: (currentData?.visitors || 0) + 1 })
          .eq("website_id", website.id);

        if (updateError) {
          console.error("Error updating analytics:", updateError);
        }
      }
    }
  });
  // Effect to increment visitors when page loads
  useEffect(() => {
    if (website?.id) {
      updateAnalytics.mutate();
    }
  }, [website]);

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

  // Function to update click count for social media
  const handleSocialClick = async (platform: string) => {
    const column = `${platform.toLowerCase()}_click_count`;
    if (!website?.id) return;

    // First get current count
    const { data: currentData, error: fetchError } = await supabase
      .from("analytics")
      .select(column)
      .eq("website_id", website.id)
      .single();

    if (fetchError) {
      console.error(`Error fetching ${platform} clicks:`, fetchError);
      return;
    }

    // Then update with incremented value
    const { error: updateError } = await supabase
      .from("analytics")
      .update({ [column]: (currentData?.[column] || 0) + 1 })
      .eq("website_id", website.id);

    if (updateError) console.error(`Error updating ${platform} clicks:`, updateError);
  };

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
        handleSocialClick={handleSocialClick} // Pass click handler
      />
    </div>
  );
};

export default WebsiteDisplay;
