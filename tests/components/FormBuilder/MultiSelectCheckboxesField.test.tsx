import { describe, it, expect } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderFormField } from "tests/helpers/renderFormField";
import {
  MultiSelectCheckboxes,
  MultiSelectCheckboxesFieldProps,
} from "#/components";

describe("MultiSelectCheckboxes", () => {
  const field: MultiSelectCheckboxesFieldProps = {
    type: "multi_select_checkbox",
    name: "test",
    value: "",
    options: [
      { value: "option1", label: "Option 1" },
      { value: "option2", label: "Option 2" },
    ],
  };

  it("renders checkboxes for each option", () => {
    renderFormField(MultiSelectCheckboxes, field);
    const checkbox1 = screen.getByLabelText("Option 1");
    const checkbox2 = screen.getByLabelText("Option 2");
    expect(checkbox1).toBeInTheDocument();
    expect(checkbox2).toBeInTheDocument();
  });

  it("updates the form state when checkboxes are checked/unchecked", () => {
    const { form } = renderFormField(MultiSelectCheckboxes, field);
    const checkbox1 = screen.getByLabelText("Option 1");
    const checkbox2 = screen.getByLabelText("Option 2");
    fireEvent.click(checkbox1);
    fireEvent.click(checkbox2);
    expect(form.getValues(field.name)).toEqual(["option1", "option2"]);
    fireEvent.click(checkbox1);
    expect(form.getValues(field.name)).toEqual(["option2"]);
  });
});
