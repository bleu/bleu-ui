import React from "react";

// import { FieldArray } from "./fields/ArrayField";
import { CheckboxField } from "./fields/CheckboxField";
import { DatePickerInput } from "./fields/DatePickerInput";
import { HiddenField } from "./fields/HiddenField";
import { ImageUploadField } from "./fields/ImageUploadField";
import { InputField } from "./fields/InputField";
import { MultiSelectCheckboxes } from "./fields/MultiSelectCheckboxesField";

import { RadioGroupField } from "./fields/RadioGroupField";
// import { RichTextEditorField } from "./fields/RichTextEditorField";
import { ColorPickerField } from "./fields/selects/ColorPickerField";
import { MultiSelect } from "./fields/selects/MultiSelect";
import { RadiusSelect } from "./fields/selects/RadiusSelect";
import { SearchableSelectField } from "./fields/selects/SearchableSelectField";
import { SelectField } from "./fields/selects/SelectField";
import { SwitchField } from "./fields/SwitchField";
import { TextAreaField } from "./fields/TextAreaField";
import { BaseField, CommonFieldProps } from ".";

export const fieldComponents = {
  input: InputField,
  checkbox: CheckboxField,
  radio_item: RadioGroupField,
  textarea: TextAreaField,
  date: DatePickerInput,
  datetime: DatePickerInput,
  image: ImageUploadField,
  switch: SwitchField,
  select: SelectField,
  multi_select: MultiSelect,
  // field_array: FieldArray,
  hidden: HiddenField,
  // wysiwyg: RichTextEditorField,
  multi_select_checkbox: MultiSelectCheckboxes,
  color_picker: ColorPickerField,
  searchable_select: SearchableSelectField,
  radius_select: RadiusSelect,
} as const;

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
