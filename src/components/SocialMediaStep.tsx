import React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
  facebook_url: z.string().url("Invalid URL").optional().or(z.literal("")),
  twitter_url: z.string().url("Invalid URL").optional().or(z.literal("")),
  instagram_url: z.string().url("Invalid URL").optional().or(z.literal("")),
  linkedin_url: z.string().url("Invalid URL").optional().or(z.literal("")),
})
  
type FormValues = z.infer<typeof formSchema>

export const SocialMediaStep = ({ onComplete, initialData }) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      facebook_url: "",
      twitter_url: "",
      instagram_url: "",
      linkedin_url: "",
    },
  })
 
  // Add auto-save
  React.useEffect(() => {
    const subscription = form.watch((value) => {
      onComplete(value)
    })
    return () => subscription.unsubscribe()
  }, [form.watch, onComplete])

  return (
    <Form {...form}>
      <div className="space-y-6">
        {[
          { name: "facebook_url", label: "Facebook URL" },
          { name: "twitter_url", label: "Twitter URL" },
          { name: "instagram_url", label: "Instagram URL" },
          { name: "linkedin_url", label: "LinkedIn URL" },
        ].map((field) => (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name as keyof FormValues}
            render={({ field: fieldProps }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  <Input {...fieldProps} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
      </div>
    </Form>
  )
}

