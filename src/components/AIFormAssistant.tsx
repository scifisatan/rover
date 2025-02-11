import React from 'react';
import { Bot, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

interface AIFormAssistantProps {
  userInput: string;
  currentStep: string;
  onSuggestion: (suggestions: any) => void;
}

export function AIFormAssistant({ userInput, currentStep, onSuggestion }: AIFormAssistantProps) {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = React.useState(false);

  const generateSuggestions = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('http://localhost:8000/api/form-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userInput,
          currentStep,
        }),
      });

      if (!response.ok) throw new Error('Failed to get suggestions');
      
      const data = await response.json();
      onSuggestion(data.suggestions);
      
      toast({
        title: "AI Suggestions Ready",
        description: "Review and apply the suggestions as needed",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate suggestions",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
   <>
   </>
  );
}

export default AIFormAssistant;
