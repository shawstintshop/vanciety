import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const VanIntelligence = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="container mx-auto px-4 py-12">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div className="text-center py-12">
            <h1 className="text-4xl font-bold mb-4">Van Intelligence</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              AI-powered van life insights, trends, and recommendations coming soon.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VanIntelligence;
