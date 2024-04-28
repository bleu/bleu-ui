import { describe, it, expect } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderFormField } from "tests/helpers/renderFormField";
import { InputField } from "#/components";

describe("InputField", () => {
  it("renders an input element", () => {
    const field = { type: "input", name: "test", value: "" };
    renderFormField(InputField, field);
    const inputElement = screen.getByRole("textbox");
    expect(inputElement).toBeInTheDocument();
  });

  // it("applies the appropriate validation rules", () => {
  //   const field = { type: "input", name: "test", required: true };
  //   render(<TestForm field={field} />);
  //   const inputElement = screen.getByRole("textbox");
  //   fireEvent.change(inputElement, { target: { value: "" } });
  //   expect(inputElement).toBeInvalid();
  // });

  it("updates the form state correctly when interacted with", () => {
    const field = {
      type: "input",
      name: "test",
      value: "",
      defaultValue: "",
      mode: "text",
    } as const;
    const { form } = renderFormField(InputField, field);
    const inputElement = screen.getByRole("textbox");
    fireEvent.change(inputElement, { target: { value: "Test value" } });
    expect(form.getValues("test")).toBe("Test value");
  });
});
