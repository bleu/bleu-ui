import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useForm } from "react-hook-form";
import { buildForm } from "#/components/FormBuilder/buildForm";
import { InputField } from "#/components/FormBuilder/fields/InputField";

describe("buildForm", () => {
  const fields = [
    { type: "input", name: "firstName", value: "", mode: "text" },
    { type: "textarea", name: "description", value: "" },
  ];
  const { result: renderHookResult } = renderHook(() => useForm());
  const form = renderHookResult.current;

  it("returns an array of form elements", () => {
    const result = buildForm(fields, form);
    expect(Array.isArray(result)).toBe(true);
  });

  it("throws an error when an invalid field type is provided", () => {
    const invalidFields = [{ type: "invalid", name: "test", value: "" }];
    expect(() => buildForm(invalidFields, form)).toThrowError(
      "Invalid field type: invalid"
    );
  });

  it("uses custom components when provided", () => {
    const customFields = [
      { type: "joana", name: "description", value: "", mode: "text" } as const,
    ];
    const customComponents = {
      joana: InputField,
    };

    // @ts-ignore
    const result = buildForm(customFields, form, 0, customComponents);

    expect(result[0]?.type).toBe(InputField);
  });

  it("does not render elements when conditions are not met", () => {
    const conditionalFields = [
      {
        type: "input",
        name: "age",
        value: "",
        conditions: { anyOf: [{ age: ["18"] }] }, // Conditions not met, since 'age' is not 18 in the form
      },
    ];
    const result = buildForm(conditionalFields, form);
    expect(result.length).toBe(0); // No form element should be rendered
  });
});
