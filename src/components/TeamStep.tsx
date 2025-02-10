import React from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Plus, Trash, Upload } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"

const memberSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  role: z.string().min(2, "Role must be at least 2 characters"),
  image_url: z.string().optional(),
  display_order: z.number().default(0),
})
 
const formSchema = z.object({
  members: z.array(memberSchema),
})
 
type FormValues = z.infer<typeof formSchema>

export const TeamStep = ({ onComplete, initialData }) => {
  const { toast } = useToast()
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || { 
      members: [{ name: "", role: "", image_url: "", display_order: 0 }] 
    },
  })

  // Add auto-save effect
  React.useEffect(() => {
    const subscription = form.watch((value) => {
      onComplete({ members: value.members })
    })
    return () => subscription.unsubscribe()
  }, [form.watch, onComplete])

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "members",
  })

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = event.target.files?.[0]
    if (!file) return

    const fileExt = file.name.split(".").pop()
    const fileName = `${self.crypto.randomUUID()}.${fileExt}`

    try {
      const { error: uploadError, data } = await supabase.storage.from("business_images").upload(fileName, file)

      if (uploadError) throw uploadError

      const {
        data: { publicUrl },
      } = supabase.storage.from("business_images").getPublicUrl(fileName)

      form.setValue(`members.${index}.image_url`, publicUrl)
      toast({ title: "Image uploaded successfully" })
    } catch (error: any) {
      toast({
        title: "Error uploading image",
        description: error.message,
        variant: "destructive",
      })
    }
  }
 
  return (
    <Form {...form}>
      <div className="space-y-6">
        {fields.map((field, index) => (
          <div key={field.id} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Team Member {index + 1}</h3>
              {fields.length > 1 && (
                <Button type="button" variant="destructive" onClick={() => remove(index)}>
                  <Trash className="h-4 w-4" />
                </Button>
              )}
            </div> 
            {["name", "role"].map((fieldName: "name" | "role") => (
              <FormField
                key={fieldName}
                control={form.control}
                name={`members.${index}.${fieldName}`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <FormField
              control={form.control}
              name={`members.${index}.image_url`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile Picture</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      {field.value && (
                        <img
                          src={field.value || "/placeholder.svg"}
                          alt="Preview"
                          className="h-40 w-40 rounded-lg object-cover"
                        />
                      )}
                      <div className="flex gap-4 items-center">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, index)}
                          className="hidden"
                          id={`image-${index}`}
                        />
                        <label
                          htmlFor={`image-${index}`}
                          className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-md cursor-pointer"
                        >
                          <Upload className="h-4 w-4" />
                          {field.value ? "Change Image" : "Upload Image"}
                        </label>
                      </div>
                    </div>
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
          onClick={() => append({ name: "", role: "", image_url: "", display_order: fields.length })}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Team Member
        </Button>
      </div>
    </Form>
  )
}

