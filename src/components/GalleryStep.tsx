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

const imageSchema = z.object({
  image_url: z.string().min(1, "Image is required"),
  caption: z.string().optional(),
  display_order: z.number().default(0),
})
 
const formSchema = z.object({
  images: z.array(imageSchema).min(1, "Add at least one image"),
})
 
type FormValues = z.infer<typeof formSchema>

export const GalleryStep = ({ onComplete, initialData }) => {
  const { toast } = useToast()
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      images: [{ image_url: "", caption: "", display_order: 0 }],
    },
  }) 

  // Add auto-save effect
  React.useEffect(() => {
    const subscription = form.watch((value) => {
      onComplete({ images: value.images })
    })
    return () => subscription.unsubscribe()
  }, [form.watch, onComplete])

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "images",
  })

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = event.target.files?.[0]
    if (!file) return

    const fileExt = file.name.split(".").pop()
    const fileName = `${self.crypto.randomUUID()}.${fileExt}`

    try {
      const { error: uploadError } = await supabase.storage.from("business_images").upload(fileName, file)

      if (uploadError) throw uploadError

      const {
        data: { publicUrl },
      } = supabase.storage.from("business_images").getPublicUrl(fileName)

      form.setValue(`images.${index}.image_url`, publicUrl)
      toast({ title: "Image uploaded successfully" })
    } catch (error: any) {
      toast({
        title: "Error uploading image",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const onSubmit = (data: FormValues) => {
    onComplete({ images: data.images.map((image, index) => ({ ...image, display_order: index })) })
  }

  return (
    <Form {...form}>
      <div className="space-y-6">
        {fields.map((field, index) => (
          <div key={field.id} className="space-y-4 p-4 border rounded-md">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Image {index + 1}</h3>
              {fields.length > 1 && (
                <Button type="button" variant="destructive" onClick={() => remove(index)}>
                  <Trash className="h-4 w-4" />
                </Button>
              )}
            </div>
            <FormField
              control={form.control}
              name={`images.${index}.image_url`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image *</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      {field.value && (
                        <img
                          src={field.value || "/placeholder.svg"}
                          alt="Preview"
                          className="w-full h-60 rounded-lg object-cover"
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
            <FormField
              control={form.control}
              name={`images.${index}.caption`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Caption</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
          onClick={() => append({ image_url: "", caption: "", display_order: fields.length })}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Image
        </Button>
      </div>
    </Form>
  )
}

