import React from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";

export interface BaseField {
  conditions?: Array<{
    name: string;
    value: string | Array<string>;
  }>;
  defaultValue?: string;
  description?: string;
  disabled?: boolean | ((data: FieldValues) => boolean);
  index?: number;
  label?: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  type?: string;
  value: string;
  // Other common properties...
}

export interface CommonFieldProps<T extends BaseField> {
  field: T;
  form: UseFormReturn<FieldValues>;
}

export function withConditional<T extends BaseField>(
  Component: React.ComponentType<CommonFieldProps<T>>
) {
  return (props: CommonFieldProps<T>) => {
    const { form, field } = props;

    const conditions = Array.isArray(field.conditions)
      ? field.conditions
      : null;

    if (!conditions) return <Component {...props} />;

    const watchedFields = conditions.map((condition) =>
      condition
        ? form.watch(condition.name.replace("RESOURCE_ID", String(field.index)))
        : null
    );

    // determine if all conditions are satisfied
    const shouldRender = conditions.every((condition, index) => {
      if (!condition) return true; // No condition means always render

      const watchField = watchedFields[index];
      if (condition.value instanceof Array) {
        return condition.value.includes(watchField);
      }
      return watchField === condition.value;
    });

    if (!shouldRender) return null;

    return <Component {...props} />;
  };
}
