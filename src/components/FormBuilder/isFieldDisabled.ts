import { FormFieldProps, CommonFieldProps } from "./types";

type FieldProps = CommonFieldProps<FormFieldProps>;

export default function isFieldDisabled(
  form: FieldProps["form"],
  field: FieldProps["field"]
) {
  return typeof field.disabled === "function"
    ? field.disabled(form.getValues())
    : field.disabled;
}
