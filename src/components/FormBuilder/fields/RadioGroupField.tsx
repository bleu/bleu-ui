import React from "react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import { Label } from "@/components/ui/Label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/RadioGroup";

import { BaseField, withConditional } from "../fields";

export interface RadioGroupFieldProps extends BaseField {
  sections: Array<{
    description: string;
    label: string;
    options: Array<{
      label: string;
      value: string;
    }>;
  }>;
}

export const RadioGroupField = withConditional<RadioGroupFieldProps>(
  ({ form, field }) => (
    // TODO: handle this case
    // const hasSections = field.sections.length > 0;
    // if (!hasSections) return;

    <FormField
      control={form.control}
      name={field.name}
      rules={field.required ? { required: true } : undefined}
      render={({ field: formField }) => (
        <FormItem className="space-y-0">
          <FormLabel>{field.label}</FormLabel>
          <FormDescription className="">{field.description}</FormDescription>
          <FormControl>
            <RadioGroup
              onValueChange={formField.onChange}
              defaultValue={formField.value}
              className="py-2"
            >
              <div className="grid grid-cols-2 gap-4">
                {field.sections.map((section) => (
                  <div key={section.label} className="space-y-2">
                    <Label>{section.label}</Label>
                    <p className="text-muted-foreground text-sm">
                      {section.description}
                    </p>
                    <div className="flex flex-col gap-1 rounded-md border-red-800 p-2">
                      {section.options.map((option) => (
                        <FormItem
                          key={option.value}
                          className="flex items-center space-x-3 space-y-0"
                        >
                          <FormControl>
                            <RadioGroupItem value={option.value} />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {option.label}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
);
