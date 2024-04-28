import React from "react";
import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { FormProvider, useForm } from "react-hook-form";
import {
  FormFieldProvider,
  FormItemProvider,
  useFormField,
} from "#/components";
import { renderHookWithError } from "../../../tests/setup";

describe("useFormField", () => {
  const wrapper = ({ children }) => {
    const methods = useForm();
    return (
      <FormProvider {...methods}>
        <FormFieldProvider name="test" render={() => <div />}>
          <FormItemProvider>{children}</FormItemProvider>
        </FormFieldProvider>
      </FormProvider>
    );
  };
  it("returns the correct field state and item state", () => {
    const { result } = renderHook(() => useFormField(), { wrapper });
    expect(result.current.name).toBe("test");
    expect(result.current.id).toBeTruthy();
  });

  it("returns the field state from the form context", () => {
    const { result } = renderHook(() => useFormField(), { wrapper });
    expect(result.current.name).toBe("test");
    expect(result.current.isTouched).toBe(false);
  });

  it("throws an error when used outside of FormField", () => {
    expect(() => renderHookWithError(() => useFormField())).toThrowError(
      /useFormFieldState must be used within a FormFieldProvider/
    );
  });
});
