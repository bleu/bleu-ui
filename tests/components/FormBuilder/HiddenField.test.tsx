import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { HiddenField } from "#/components";
import { renderFormField } from "../../../tests/helpers/renderFormField";

describe("HiddenField", () => {
  it("renders a hidden input field", () => {
    const { form } = renderFormField(HiddenField, {
      type: "hidden",
      name: "test",
      value: "hiddenValue",
    });
    const hiddenInput = form.getValues("test");
    expect(hiddenInput).toBe("hiddenValue");
  });

  it("does not render any visible elements", () => {
    renderFormField(HiddenField, {
      type: "hidden",
      name: "test",
      value: "hiddenValue",
    });
    const hiddenInput = screen.queryByRole("textbox");
    expect(hiddenInput).not.toBeInTheDocument();
  });
});
