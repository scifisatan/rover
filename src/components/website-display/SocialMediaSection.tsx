
import { FC } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

interface SocialMediaSectionProps {
  facebookUrl?: string;
  twitterUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
}

export const SocialMediaSection: FC<SocialMediaSectionProps> = ({
  facebookUrl,
  twitterUrl,
  instagramUrl,
  linkedinUrl,
}) => {
  if (!facebookUrl && !twitterUrl && !instagramUrl && !linkedinUrl) return null;

  return (
    <section className="py-20 bg-gradient-to-t from-secondary/10 to-transparent">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-semibold mb-12 text-center">Connect With Us</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {facebookUrl && (
            <Button variant="outline" asChild className="group hover:bg-[#1877F2]/10">
              <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <Facebook className="h-4 w-4 group-hover:text-[#1877F2]" />
                <span className="group-hover:text-[#1877F2]">Facebook</span>
                <ArrowUpRight className="h-4 w-4 group-hover:text-[#1877F2] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </Button>
          )}
          {twitterUrl && (
            <Button variant="outline" asChild className="group hover:bg-[#1DA1F2]/10">
              <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <Twitter className="h-4 w-4 group-hover:text-[#1DA1F2]" />
                <span className="group-hover:text-[#1DA1F2]">Twitter</span>
                <ArrowUpRight className="h-4 w-4 group-hover:text-[#1DA1F2] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </Button>
          )}
          {instagramUrl && (
            <Button variant="outline" asChild className="group hover:bg-[#E4405F]/10">
              <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <Instagram className="h-4 w-4 group-hover:text-[#E4405F]" />
                <span className="group-hover:text-[#E4405F]">Instagram</span>
                <ArrowUpRight className="h-4 w-4 group-hover:text-[#E4405F] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </Button>
          )}
          {linkedinUrl && (
            <Button variant="outline" asChild className="group hover:bg-[#0A66C2]/10">
              <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <Linkedin className="h-4 w-4 group-hover:text-[#0A66C2]" />
                <span className="group-hover:text-[#0A66C2]">LinkedIn</span>
                <ArrowUpRight className="h-4 w-4 group-hover:text-[#0A66C2] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};
