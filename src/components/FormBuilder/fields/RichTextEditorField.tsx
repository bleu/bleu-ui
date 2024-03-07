import React from "react";
import { RichTextEditor } from "#/components/RichTextEditor";
import {
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "#/components/ui/Form";

import { BaseField, withConditional } from "../fields";

export interface RichTextEditorFieldProps extends BaseField {
  type: "wysiwyg";
}

export const RichTextEditorField = withConditional<RichTextEditorFieldProps>(
  ({ form, field }) => {
    const { control, setValue } = form;
    const defaultValue = form.getValues(field.name) || field.defaultValue || "";

    const handleRichTextChange = (content) => {
      setValue(field.name, content);
    };

    return (
      <FormField
        control={control}
        name={field.name}
        // @ts-ignore
        rules={
          field.required && {
            required: true,
          }
        }
        defaultValue={defaultValue}
        render={({ field: formField }) => (
          <FormItem className="w-full">
            <FormLabel tooltip={field.tooltip}>{field.label}</FormLabel>
            <FormDescription>{field.description}</FormDescription>
            <input hidden {...formField} value={formField.value} />
            <RichTextEditor
              initialValue={
                typeof formField.value === "string" ? formField.value : ""
              }
              onChange={handleRichTextChange}
            />
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }
);
