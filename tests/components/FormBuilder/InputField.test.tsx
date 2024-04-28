import { describe, it, expect } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderFormField } from "tests/helpers/renderFormField";
import { InputField } from "#/components";

describe("InputField", () => {
  const field = { type: "input", name: "test", value: "" };
  it("renders an input element", () => {
    renderFormField(InputField, field);
    const inputElement = screen.getByRole("textbox");
    expect(inputElement).toBeInTheDocument();
  });

  it("applies the disabled prop when set to true", () => {
    renderFormField(InputField, { ...field, disabled: true });
    const inputElement = screen.getByRole("textbox");
    expect(inputElement).toBeDisabled();
  });

  // it("shows an error message when the input value is invalid", async () => {
  //   renderFormField(InputField, {
  //     ...field,
  //     required: true,
  //     length: { minimum: 5 },
  //   });
  //   const inputElement = screen.getByRole("textbox");
  //   fireEvent.change(inputElement, { target: { value: "test" } });
  //   fireEvent.blur(inputElement);
  //   const errorMessage = await screen.findByRole("alert");
  //   expect(errorMessage).toBeInTheDocument();
  // });

  it("updates the form state correctly when interacted with", () => {
    const { form } = renderFormField(InputField, {
      type: "input",
      name: "test",
      value: "",
      defaultValue: "",
      mode: "text",
    });
    const inputElement = screen.getByRole("textbox");
    fireEvent.change(inputElement, { target: { value: "Test value" } });
    expect(form.getValues("test")).toBe("Test value");
  });
});
