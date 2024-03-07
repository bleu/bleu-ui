import React from "react";
import { Checkbox } from "#/components/ui/Checkbox";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "#/components/ui/Form";

import { BaseField, withConditional } from "../fields";

export interface CheckboxFieldProps extends BaseField {
  type: "checkbox";
}

export const CheckboxField = withConditional<CheckboxFieldProps>(
  ({ form, field }) => (
    <FormField
      control={form.control}
      name={field.name}
      render={({ field: formField }) => (
        <FormItem className="flex min-w-fit flex-row items-start space-x-3 space-y-0">
          <input
            type="hidden"
            hidden
            name={field.name}
            value={String(formField.value)}
          />
          <FormControl>
            <Checkbox
              checked={formField.value}
              onCheckedChange={formField.onChange}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel tooltip={field.tooltip}>{field.label}</FormLabel>
            <FormDescription>{field.description}</FormDescription>
          </div>
        </FormItem>
      )}
    />
  )
);
