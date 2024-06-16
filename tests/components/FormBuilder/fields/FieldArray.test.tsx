import { describe, it, expect } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderFormField } from "tests/helpers/renderFormField";
import {
  FieldArray,
  FieldArrayFieldProps,
} from "#/components/FormBuilder/fields/FieldArray";

describe("FieldArray", () => {
  it("renders an 'Add' button", () => {
    const field: FieldArrayFieldProps = {
      type: "field_array",
      name: "test",
      value: "",
      defaultValues: { name: "" },
      fields: [],
      hasSequence: false,
    };

    renderFormField(FieldArray, field);
    const addButton = screen.getByText("Add");
    expect(addButton).toBeInTheDocument();
  });

  it("adds a new field when the 'Add' button is clicked", () => {
    const field: FieldArrayFieldProps = {
      type: "field_array",
      name: "test",
      value: "",
      label: "Test",
      defaultValues: { name: "" },
      fields: [
        {
          type: "input",
          name: "name",
          label: "Name",
          value: "",
        },
      ],
      hasSequence: false,
    };
    const { form } = renderFormField(FieldArray, field);

    const addButton = screen.getByText(`Add ${field.label}`);
    fireEvent.click(addButton);
    expect(form.getValues(field.name)).toHaveLength(1);
  });

  // it("removes a field when the remove button is clicked", () => {
  //   const field = {
  //     type: "field_array",
  //     name: "test",
  //     defaultValues: { name: "" },
  //     fields: [{ type: "input", name: "name" }],
  //     hasSequence: false,
  //     remove: true,
  //   };
  //   const { result } = renderHook(() =>
  //     useForm({ defaultValues: { [field.name]: [{ name: "John" }] } })
  //   );
  //   render(<TestForm field={field} form={result.current} />);
  //   const removeButton = screen.getByTestId("remove-button");
  //   fireEvent.click(removeButton);
  //   expect(result.current.getValues(field.name)).toHaveLength(0);
  // });
});
