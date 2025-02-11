import React from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash } from "lucide-react"
import { AutofillButton } from "@/components/ui/AutofillButton"
import { FormStepLayout } from "@/components/website-form/FormStepLayout"

const featureSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().optional(),
  display_order: z.number().default(0),
})
 
const formSchema = z.object({
  features: z.array(featureSchema).min(1, "Add at least one feature"),
})
  
type FormValues = z.infer<typeof formSchema>

export const FeaturesStep = ({ onComplete, initialData }) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      features: [{ title: "", description: "", display_order: 0 }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "features",
  })

  // Auto-save on form changes
  React.useEffect(() => {
    const subscription = form.watch((value) => {
      onComplete(value)
    })
    return () => subscription.unsubscribe()
  }, [form.watch, onComplete])

  const onSubmit = (data: FormValues) => {
    onComplete({ features: data.features.map((feature, index) => ({ ...feature, display_order: index })) })
  }

  const handleSuggestions = (suggestions: any) => {
    if (suggestions?.features) {
      // Replace existing features with suggestions
      suggestions.features.forEach((feature: any, index: number) => {
        if (index >= form.getValues('features').length) {
          form.append('features', feature)
        } else {
          form.setValue(`features.${index}.title`, feature.title)
          form.setValue(`features.${index}.description`, feature.description)
        }
      })
    }
  }

  return (
    <FormStepLayout
      currentStep="features"
      userInput={form.getValues('features')?.[0]?.title || ''}
      onSuggestions={handleSuggestions}
    >
      <Form {...form}>
        <div className="space-y-6">
          {fields.map((field, index) => (
            <div key={field.id} className="space-y-4 p-4 border rounded-md">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Feature {index + 1}</h3>
                {fields.length > 1 && (
                  <Button type="button" variant="destructive" onClick={() => remove(index)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <FormField
                control={form.control}
                name={`features.${index}.title`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`features.${index}.description`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => append({ title: "", description: "", display_order: fields.length })}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Feature
          </Button>
        </div>
      </Form>
    </FormStepLayout>
  )
}

