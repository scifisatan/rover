
import { FC } from "react";

interface HeroSectionProps {
  businessName: string;
  tagline?: string;
  description?: string;
}

export const HeroSection: FC<HeroSectionProps> = ({ businessName, tagline, description }) => {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32 bg-gradient-to-b from-primary/5 to-transparent">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-6 animate-fade-in">
          <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            {businessName}
          </h1>
          {tagline && (
            <p className="text-2xl text-muted-foreground font-light">{tagline}</p>
          )}
          {description && (
            <p className="text-lg text-muted-foreground/80 leading-relaxed max-w-2xl mx-auto">
              {description}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};
