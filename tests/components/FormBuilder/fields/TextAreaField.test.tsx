import { describe, it, expect } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderFormField } from "tests/helpers/renderFormField";
import {
  TextAreaField,
  TextAreaFieldProps,
} from "#/components/FormBuilder/fields/TextAreaField";

describe("TextAreaField", () => {
  const field: TextAreaFieldProps = {
    type: "textarea",
    name: "test",
    value: "",
  };

  it("renders a textarea element", () => {
    renderFormField(TextAreaField, field);

    const textareaElement = screen.getByRole("textbox");
    expect(textareaElement).toBeInTheDocument();
  });

  // it("applies the appropriate validation rules", () => {
  //   const field = { type: "textarea", name: "test", required: true };
  //   renderFormField(TextAreaField, field);
  //   const textareaElement = screen.getByRole("textbox");
  //   fireEvent.change(textareaElement, { target: { value: "" } });
  //   expect(textareaElement).toBeInvalid();
  // });
  it("applies the disabled prop when set to true", () => {
    renderFormField(TextAreaField, { ...field, disabled: true });
    const textareaElement = screen.getByRole("textbox");
    expect(textareaElement).toBeDisabled();
  });

  it("updates the form state correctly when interacted with", () => {
    const { form } = renderFormField(TextAreaField, field);
    const textareaElement = screen.getByRole("textbox");
    fireEvent.change(textareaElement, { target: { value: "Test value" } });
    expect(form.getValues("test")).toBe("Test value");
  });
});
