
import { FC } from "react";

interface Feature {
  id: number;
  title: string;
  description?: string;
  display_order: number;
}

interface FeaturesSectionProps {
  features: Feature[];
}

export const FeaturesSection: FC<FeaturesSectionProps> = ({ features }) => {
  if (!features || features.length === 0) return null;

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-semibold mb-12 text-center">What We Offer</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features
            .sort((a, b) => a.display_order - b.display_order)
            .map((feature) => (
              <div
                key={feature.id}
                className="group p-6 rounded-xl bg-card/50 hover:bg-card transition-all duration-300 hover:shadow-lg"
              >
                <h3 className="text-xl font-medium mb-3 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                {feature.description && (
                  <p className="text-muted-foreground group-hover:text-foreground/80 transition-colors">
                    {feature.description}
                  </p>
                )}
              </div>
            ))}
        </div>
      </div>
    </section>
  );
};
