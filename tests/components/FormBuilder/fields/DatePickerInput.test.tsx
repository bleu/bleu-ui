import { vi, describe, it, expect } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderFormField } from "tests/helpers/renderFormField";
import {
  DatePickerInput,
  DatePickerInputProps,
} from "#/components/FormBuilder/fields/DatePickerInput";

describe("DatePickerInput", () => {
  const mockDate = new Date(2022, 0, 1);
  const field: DatePickerInputProps = {
    type: "date",
    name: "test",
    defaultValue: "",
    value: "",
  };

  it("renders a date picker input", () => {
    renderFormField(DatePickerInput, field);

    const datePickerElement = screen.getByText("Pick a date");
    expect(datePickerElement).toBeInTheDocument();
  });

  it("displays the selected date in the correct format", () => {
    vi.setSystemTime(mockDate);
    renderFormField(DatePickerInput, {
      ...field,
      defaultValue: mockDate.toDateString(),
    });
    const buttonElement = screen.getByRole("button");
    expect(buttonElement).toHaveTextContent("Jan 1, 2022");
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
