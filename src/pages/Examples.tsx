
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Examples = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 p-8">
      <Button asChild variant="ghost" className="mb-8">
        <Link to="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </Button>
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Example Websites</h1>
        <p className="text-center text-muted-foreground mb-12">
          Coming soon: Browse through our collection of example websites
        </p>
      </div>
    </div>
  );
};

export default Examples;
