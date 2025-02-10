import React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth"
import { useState } from "react"

const formSchema = z.object({
  business_name: z.string().min(2, "Business name must be at least 2 characters"),
  tagline: z.string().optional(),
  description: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export const BasicInfoStep = ({ onComplete, initialData }) => {
  const { user } = useSupabaseAuth()
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || { 
      business_name: "", 
      tagline: "", 
      description: "" 
    },
  })

  // Auto-save on form changes
  React.useEffect(() => {
    const subscription = form.watch((value) => {
      if (user?.id) {
        onComplete({ ...value, user_id: user.id })
      }
    })
    return () => subscription.unsubscribe()
  }, [form.watch, onComplete, user])

  return (
    <Form {...form}>
      <div className="space-y-6">
        {[
          { name: "business_name", label: "Business Name", required: true },
          { name: "tagline", label: "Tagline" },
        ].map((field) => (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name as keyof FormValues}
            render={({ field: fieldProps }) => (
              <FormItem>
                <FormLabel>
                  {field.label}
                  {field.required && " *"}
                </FormLabel>
                <FormControl>
                  <Input {...fieldProps} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <FormField
          control={form.control}
          name="description"
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
    </Form>
  )
}

