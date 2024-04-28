import { vi, describe, it, expect } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderFormField } from "tests/helpers/renderFormField";
import { DatePickerInput } from "#/components";

describe("DatePickerInput", () => {
  const mockDate = new Date(2022, 0, 1);
  const field = {
    type: "date",
    name: "test",
    defaultValue: "",
  };

  it("renders a date picker input", () => {
    renderFormField(DatePickerInput, field);

    const datePickerElement = screen.getByText("Pick a date");
    expect(datePickerElement).toBeInTheDocument();
  });

  it("updates the form state correctly when a date is selected", () => {
    vi.setSystemTime(mockDate);
    const { form } = renderFormField(DatePickerInput, field);

    const datePickerElement = screen.getByText("Pick a date");
    fireEvent.click(datePickerElement);
    const dateElement = screen.getByText("10");
    fireEvent.click(dateElement);

    expect(form.getValues("test")).toStrictEqual(new Date(2022, 0, 10));
  });
});
