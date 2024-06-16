import * as React from "react";
import { RenderResult, render, renderHook } from "@testing-library/react";
import { useForm, FormProvider, UseFormProps } from "react-hook-form";
import { CommonFieldProps, FormFieldProps } from "#/components";

export const renderFormField = (
  FieldComponent: unknown,
  field: CommonFieldProps<FormFieldProps>["field"],
  formProps?: UseFormProps
): {
  form: CommonFieldProps<FormFieldProps>["form"];
} & RenderResult => {
  const { result } = renderHook(() => useForm(formProps));
  const form = result.current;

  const Component = FieldComponent as React.ElementType<
    CommonFieldProps<FormFieldProps>
  >;

  return {
    form,
    ...render(
      <React.Suspense fallback={<div>Loading...</div>}>
        <FormProvider {...form}>
          <Component form={form} field={field} />
        </FormProvider>
      </React.Suspense>
    ),
  };
};
