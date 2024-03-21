import React from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";

import { CheckboxFieldProps } from "./fields/CheckboxField";
import { DatePickerInputProps } from "./fields/DatePickerInput";
import { FileUploadFieldProps } from "./fields/FileUploadField";
import { InputFieldProps } from "./fields/InputField";
import { RadioGroupFieldProps } from "./fields/RadioGroupField";
import { RichTextEditorFieldProps } from "./fields/RichTextEditorField";
import { SelectFieldProps } from "./fields/selects/SelectField";
import { TextAreaFieldProps } from "./fields/TextAreaField";
import { FieldArrayFieldProps } from "./fields/FieldArray";
import { FieldComponentType } from "./buildForm";

export interface BaseField {
  component?: React.ComponentType<CommonFieldProps<BaseField>>;
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
  tooltip?: string;
  type: string;
  value: string;
  // Other common properties...
}

export interface CommonFieldProps<T extends BaseField> {
  customComponents?: { [key: string]: FieldComponentType };
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

export const parseFields = (fields, index) => {
  const updatedFields = fields.map((field) => {
    if (field.type === "field_array") {
      return {
        ...field,
        name: field.name.replace("RESOURCE_ID", index),
        fields: field.fields.map((f) => ({
          ...f,
          name: f.name.replace("RESOURCE_ID", index),
        })),
      };
    }
    return { ...field, name: field.name.replace("RESOURCE_ID", index) };
  });

  return updatedFields;
};

export type FormFieldProps =
  | InputFieldProps
  | TextAreaFieldProps
  | CheckboxFieldProps
  | DatePickerInputProps
  | FileUploadFieldProps
  | SelectFieldProps
  | RadioGroupFieldProps
  | RichTextEditorFieldProps
  | FieldArrayFieldProps;
