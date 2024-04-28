import { describe, it, expect } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderFormField } from "tests/helpers/renderFormField";
import { RadioGroupField } from "#/components";

describe("RadioGroupField", () => {
  const field = {
    type: "radio_group",
    name: "test",
    options: [
      { value: "option1", label: "Option 1" },
      { value: "option2", label: "Option 2" },
    ],
  };

  it("renders radio buttons for each option", () => {
    renderFormField(RadioGroupField, field);

    const radio1 = screen.getByLabelText("Option 1");
    const radio2 = screen.getByLabelText("Option 2");
    expect(radio1).toBeInTheDocument();
    expect(radio2).toBeInTheDocument();
  });

  it("updates the form state when a radio button is selected", () => {
    const { form } = renderFormField(RadioGroupField, field);

    const radio1 = screen.getByLabelText("Option 1");
    const radio2 = screen.getByLabelText("Option 2");

    fireEvent.click(radio1);
    expect(form.getValues("test")).toBe("option1");
    fireEvent.click(radio2);
    expect(form.getValues("test")).toBe("option2");
  });
});
