import React from "react";
import { BaseField, CommonFieldProps, fieldComponents } from "./index";

type FieldComponentType = (
  props: CommonFieldProps<BaseField>
) => React.ReactNode | null;

// In case you want to use a custom component for a specific field type
// you can pass it as an argument to the buildForm function OR in the 'component' property of the field object.
// The 'component' property will take precedence over the customComponents argument.
// The customComponents argument will take precedence over the default fieldComponents.
// If you have a set of custom components that you want to use for all fields, you can implement a wrapper function around buildForm
// that has the customComponents argument pre-filled.
// e.g. const myBuildForm = (fields, form, index = 0) => buildForm(fields, form, index, LOCAL_COMPONENTS);

export function buildForm(
  fields: CommonFieldProps<BaseField>["field"][],
  form: CommonFieldProps<BaseField>["form"],
  index = 0,
  customComponents: { [key: string]: FieldComponentType } = {}
) {
  // @ts-ignore
  const formElements = fields.map((field) => {
    // @ts-ignore
    const FieldComponent: FieldComponentType =
      field?.component ||
      { ...fieldComponents, ...customComponents }[field.type];
    if (!FieldComponent) {
      throw new Error(`Invalid field type: ${field.type}`);
    }

    const name = field.name.replace("RESOURCE_ID", String(index));

    return <FieldComponent field={{ ...field, name, index }} form={form} />;
  });

  return formElements;
}
