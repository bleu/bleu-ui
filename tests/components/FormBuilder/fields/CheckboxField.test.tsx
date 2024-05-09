import { describe, it, expect } from "vitest";
import { screen, fireEvent } from "@testing-library/react";

import { renderFormField } from "tests/helpers/renderFormField";
import { CheckboxField, CheckboxFieldProps } from "#/components";

describe("CheckboxField", () => {
  const field: CheckboxFieldProps = {
    type: "checkbox",
    name: "test",
    value: "",
    label: "Test Checkbox",
  };
  it("renders a checkbox element", () => {
    renderFormField(CheckboxField, field);

    const checkboxElement = screen.getByRole("checkbox");
    expect(checkboxElement).toBeInTheDocument();
  });

  it("renders the checkbox label correctly", () => {
    renderFormField(CheckboxField, field);
    const labelElement = screen.getByText("Test Checkbox");
    expect(labelElement).toBeInTheDocument();
  });

  it("disables the checkbox when the disabled prop is set to true", () => {
    renderFormField(CheckboxField, { ...field, disabled: true });
    const checkboxElement = screen.getByRole("checkbox");
    expect(checkboxElement).toBeDisabled();
  });

  it("updates the form state correctly when interacted with", () => {
    const { form } = renderFormField(CheckboxField, field);

    const checkboxElement = screen.getByRole("checkbox");
    fireEvent.click(checkboxElement);
    expect(form.getValues("test")).toBe(true);
  });
});
