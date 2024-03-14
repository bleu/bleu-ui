import React from "react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "#/components/ui/Form";

import { BaseField, withConditional } from "../fields";
import toTitleCase from "#/lib/textCase";

export interface TextFieldProps extends BaseField {
  type: "text";
}

export const TextField = withConditional<TextFieldProps>(({ form, field }) => (
  <FormField
    control={form.control}
    name={field.name}
    render={({ field: formField }) => (
      <FormItem className="w-full">
        <FormLabel tooltip={field.tooltip}>{field.label}</FormLabel>
        <FormDescription>{field.description}</FormDescription>
        <FormControl>
          <span>{toTitleCase(formField.value)}</span>
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
));
