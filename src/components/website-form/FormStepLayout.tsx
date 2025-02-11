import { AutofillButton } from "@/components/ui/AutofillButton"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"

interface FormStepLayoutProps {
  children: React.ReactNode
  currentStep: string
  userInput: string
  onSuggestions: (suggestions: any) => void
}

export const FormStepLayout = ({ children, currentStep, userInput, onSuggestions }: FormStepLayoutProps) => {
  const [promptInput, setPromptInput] = useState("")

  // Only show AI prompt for basic and features steps
  const showAIPrompt = currentStep === "basic" || currentStep === "features"

  return (
    <div className="grid grid-cols-1 gap-6">
      {showAIPrompt ? (
        <div className="grid grid-cols-[1fr,300px] gap-6">
          <div>{children}</div>
          <div className="sticky top-6 space-y-4">
            <Textarea
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              placeholder="Describe your business to get AI suggestions..."
              className="min-h-[100px] bg-white/10 border-white/20 text-white"
            />
            <AutofillButton
              currentStep={currentStep}
              userInput={promptInput || userInput}
              onSuggestions={(suggestions) => {
                onSuggestions(suggestions)
                setPromptInput("") // Clear the input after generating suggestions
              }}
            />
          </div>
        </div>
      ) : (
        children
      )}
    </div>
  )
}
