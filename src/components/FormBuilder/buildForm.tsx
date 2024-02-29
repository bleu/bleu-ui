import React from "react";
import { BaseField, CommonFieldProps, fieldComponents } from "./index";

export function buildForm(
  fields: CommonFieldProps<BaseField>["field"][],
  form: CommonFieldProps<BaseField>["form"],
  index = 0
) {
  // @ts-ignore
  const formElements = fields.map((field) => {
    // @ts-ignore
    const FieldComponent = field?.component || fieldComponents[field.type];
    if (!FieldComponent) {
      throw new Error(`Invalid field type: ${field.type}`);
    }

    const name = field.name.replace("RESOURCE_ID", String(index));

    return <FieldComponent field={{ ...field, name, index }} form={form} />;
  });

  return formElements;
}
