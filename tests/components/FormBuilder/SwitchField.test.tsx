import { describe, it, expect } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderFormField } from "tests/helpers/renderFormField";
import { SwitchField } from "#/components";

describe("SwitchField", () => {
  const field = { type: "switch", name: "test" };

  it("renders a switch element", () => {
    renderFormField(SwitchField, field);
    const switchElement = screen.getByRole("switch");
    expect(switchElement).toBeInTheDocument();
  });

  it("updates the form state when the switch is toggled", () => {
    const { form } = renderFormField(SwitchField, field);

    const switchElement = screen.getByRole("switch");
    fireEvent.click(switchElement);
    expect(form.getValues("test")).toBe(true);
  });

  it("disables the switch when the disabled prop is set to true", () => {
    renderFormField(SwitchField, { ...field, disabled: true });
    const switchElement = screen.getByRole("switch");
    expect(switchElement).toBeDisabled();
  });
});
