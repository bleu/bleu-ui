import React from "react";
import { z } from "zod";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "#/components/ui/Form";
import { Textarea } from "#/components/ui/Textarea";

import { BaseField, withConditional } from "../fields";

export interface TextAreaFieldProps extends BaseField {
  length?: {
    maximum?: number;
    minimum: number; // undefined or number
  };
  type: "textarea";
}

export const TextAreaField = withConditional<TextAreaFieldProps>(
  ({ form, field }) => {
    const stringSchema = z
      .string()
      .min(field.length?.minimum || 0)
      .max(field.length?.maximum || Infinity);

    return (
      <FormField
        control={form.control}
        name={field.name}
        rules={
          field.required
            ? {
                required: true,
                validate: (value) =>
                  stringSchema.safeParse(value).success ||
                  `The value must be between ${field.length?.minimum} and ${field.length?.maximum} long.`,
              }
            : undefined
        }
        render={({ field: formField }) => (
          <FormItem className="w-full">
            <FormLabel tooltip={field.tooltip}>{field.label}</FormLabel>
            <FormDescription>{field.description}</FormDescription>
            <FormControl>
              <Textarea
                placeholder={field.placeholder}
                className="resize-none"
                {...formField}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }
);
