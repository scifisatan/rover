
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
import { Plus, Trash } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const featureSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().optional(),
  display_order: z.number().default(0),
});

const formSchema = z.object({
  features: z.array(featureSchema).min(1, "Add at least one feature"),
});

type FormValues = z.infer<typeof formSchema>;

interface FeaturesStepProps {
  onComplete: (data: FormValues) => void;
}

export const FeaturesStep = ({ onComplete }: FeaturesStepProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      features: [{ title: "", description: "", display_order: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "features",
  });

  const onSubmit = (data: FormValues) => {
    // Update display order before submitting
    const featuresWithOrder = data.features.map((feature, index) => ({
      ...feature,
      display_order: index,
    }));
    onComplete({ features: featuresWithOrder });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {fields.map((field, index) => (
          <div key={field.id} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Feature {index + 1}</h3>
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
          onClick={() => append({ title: "", description: "", display_order: fields.length })}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Feature
        </Button>

        <div className="flex justify-end">
          <Button type="submit">Save and Continue</Button>
        </div>
      </form>
    </Form>
  );
};
