import React from "react";
import { z } from "zod";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";

import { BaseField, withConditional } from "../fields";

export interface InputFieldProps extends BaseField {
  length?: {
    maximum?: number;
    minimum: number; // undefined or number
  };
  mode: "text" | "number";
  type: "input";
}

export const InputField = withConditional<InputFieldProps>(
  ({ form, field }) => {
    const validator = field.mode === "number" ? z.coerce.number() : z.string();

    validator
      .min(field.length?.minimum || 0)
      .max(field.length?.maximum || Infinity);

    const numberInputOnWheelPreventChange = (e) => {
      e.target.blur();
      e.stopPropagation();
    };

    return (
      <FormField
        control={form.control}
        name={field.name}
        rules={
          field.required
            ? {
                required: true,
                validate: (value) =>
                  validator.safeParse(value).success ||
                  `The value must be between ${field.length?.minimum} and ${field.length?.maximum} long.`,
              }
            : undefined
        }
        render={({ field: formField }) => (
          <FormItem className="w-full">
            <FormLabel>{field.label}</FormLabel>
            <FormDescription>{field.description}</FormDescription>
            <FormControl>
              <Input
                placeholder={field.placeholder}
                {...formField}
                type={field.mode}
                onWheel={(event) =>
                  field.mode === "number" &&
                  numberInputOnWheelPreventChange(event)
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }
);
