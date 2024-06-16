import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";

import { renderFormField } from "../../../../tests/helpers/renderFormField";
import { HiddenField } from "#/components/FormBuilder/fields/HiddenField";
import { BaseField } from "#/components/FormBuilder/types";

describe("HiddenField", () => {
  const field: BaseField = {
    type: "hidden",
    name: "test",
    value: "hiddenValue",
  };
  it("renders a hidden input field", () => {
    const { form } = renderFormField(HiddenField, field);
    const hiddenInput = form.getValues("test");
    expect(hiddenInput).toBe("hiddenValue");
  });

  it("does not render any visible elements", () => {
    renderFormField(HiddenField, field);
    const hiddenInput = screen.queryByRole("textbox");
    expect(hiddenInput).not.toBeInTheDocument();
  });
});
