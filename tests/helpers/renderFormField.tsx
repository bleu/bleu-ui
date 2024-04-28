import * as React from "react";
import { RenderResult, render, renderHook } from "@testing-library/react";
import { useForm, FormProvider, UseFormProps } from "react-hook-form";
import { CommonFieldProps, FormFieldProps } from "#/components";

export const renderFormField = (
  FieldComponent: React.ComponentType<CommonFieldProps<FormFieldProps>>,
  field: FormFieldProps,
  formProps: UseFormProps
): {
  form: CommonFieldProps<FormFieldProps>["form"];
} & RenderResult => {
  const { result } = renderHook(() => useForm(formProps));
  const form = result.current;

  return {
    form,
    ...render(
      <FormProvider {...form}>
        <FieldComponent form={form} field={field} />
      </FormProvider>
    ),
  };
};
