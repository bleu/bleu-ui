import { describe, it, expect } from "vitest";
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
});
