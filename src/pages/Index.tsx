
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center space-y-6 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Create Your Business Website in Minutes
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Professional websites made simple. Answer a few questions about your business,
            and we'll create a stunning website tailored just for you.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Button asChild size="lg" className="gap-2">
              <Link to="/auth">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/examples">View Examples</Link>
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-32 grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={cn(
                "p-6 rounded-2xl bg-card border shadow-sm hover:shadow-md transition-all",
                "transform hover:-translate-y-1"
              )}
            >
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const features = [
  {
    title: "Easy Setup",
    description: "Answer a simple questionnaire about your business and watch your website come to life instantly.",
    icon: ArrowRight,
  },
  {
    title: "Professional Design",
    description: "Get a beautifully designed website that reflects your brand and engages your customers.",
    icon: ArrowRight,
  },
  {
    title: "Full Control",
    description: "Easily manage and update your website content through an intuitive dashboard.",
    icon: ArrowRight,
  },
];

export default Index;
