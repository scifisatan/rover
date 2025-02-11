import { Bot, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { useState } from 'react'

interface AutofillButtonProps {
  currentStep: string
  userInput: string
  onSuggestions: (suggestions: any) => void
}

export function AutofillButton({ currentStep, userInput, onSuggestions }: AutofillButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleAutofill = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('http://localhost:8000/api/form-assist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentStep,
          userInput,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get suggestions')
      }

      const data = await response.json()
      onSuggestions(data.suggestions)
      
      toast({
        title: 'AI Suggestions Ready',
        description: 'Form fields have been filled with AI suggestions',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to get AI suggestions',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      onClick={handleAutofill}
      disabled={isLoading}
      className="bg-white/10 text-white hover:bg-white/20"
    >
      {isLoading ? (
        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <Bot className="h-4 w-4 mr-2" />
      )}
      Autofill with AI
    </Button>
  )
}
