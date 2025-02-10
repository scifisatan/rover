
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash, Upload } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";

const imageSchema = z.object({
  image_url: z.string().min(1, "Image is required"),
  caption: z.string().optional(),
  display_order: z.number().default(0),
});

const formSchema = z.object({
  images: z.array(imageSchema).min(1, "Add at least one image"),
});

type FormValues = z.infer<typeof formSchema>;

interface GalleryStepProps {
  onComplete: (data: FormValues) => void;
}

export const GalleryStep = ({ onComplete }: GalleryStepProps) => {
  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      images: [{ image_url: "", caption: "", display_order: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "images",
  });

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileExt = file.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from("business_images")
        .upload(fileName, file);

      if (uploadError) {
        toast({
          title: "Error uploading image",
          description: uploadError.message,
          variant: "destructive",
        });
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from("business_images")
        .getPublicUrl(fileName);

      form.setValue(`images.${index}.image_url`, publicUrl);
      toast({
        title: "Image uploaded successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error uploading image",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const onSubmit = (data: FormValues) => {
    // Update display order before submitting
    const imagesWithOrder = data.images.map((image, index) => ({
      ...image,
      display_order: index,
    }));
    onComplete({ images: imagesWithOrder });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {fields.map((field, index) => (
          <div key={field.id} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Image {index + 1}</h3>
              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => remove(index)}
                >
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
                        Upload Image
                      </label>
                      {field.value && (
                        <img
                          src={field.value}
                          alt="Preview"
                          className="h-20 w-20 rounded object-cover"
                        />
                      )}
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

        <div className="flex justify-end">
          <Button type="submit">Save and Continue</Button>
        </div>
      </form>
    </Form>
  );
};
