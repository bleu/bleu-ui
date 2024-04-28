import React from "react";
import { render, renderHook } from "@testing-library/react";
import { useForm, FormProvider } from "react-hook-form";

export const renderFormField = (
  FieldComponent: React.ComponentType<any>,
  field: any,
  formProps: any = {}
) => {
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
