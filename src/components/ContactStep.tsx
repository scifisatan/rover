import React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Map } from "@/components/ui/map"

const formSchema = z.object({
  contact_email: z.string().email("Invalid email address").optional().or(z.literal("")),
  contact_phone: z.string().optional(),
  address: z.string().optional(),
  map_latitude: z.string().optional(),
  map_longitude: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export const ContactStep = ({ onComplete }) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contact_email: "",
      contact_phone: "",
      address: "",
      map_latitude: "",
      map_longitude: "",
    },
  })

  const handleLocationSelect = async (lat: number, lng: number, address: string) => {
    form.setValue('map_latitude', lat.toString())
    form.setValue('map_longitude', lng.toString())
    form.setValue('address', address)
  }

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
          { name: "contact_email", label: "Email", type: "email" },
          { name: "contact_phone", label: "Phone Number", type: "tel" },
          { name: "address", label: "Address", readonly: true },
        ].map((field) => (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name as keyof FormValues}
            render={({ field: fieldProps }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  <Input 
                    type={field.type || "text"} 
                    {...fieldProps} 
                    readOnly={field.readonly}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <div className="space-y-4">
          <FormLabel>Business Location</FormLabel>
          <Map 
            onLocationSelect={handleLocationSelect}
            initialLat={Number(form.watch('map_latitude')) || undefined}
            initialLng={Number(form.watch('map_longitude')) || undefined}
          />
        </div>
      </div>
    </Form>
  )
}

