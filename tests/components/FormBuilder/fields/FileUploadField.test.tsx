import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderFormField } from "tests/helpers/renderFormField";
import {
  FileUploadField,
  FileUploadFieldProps,
} from "#/components/FormBuilder/fields/FileUploadField";

describe("FileUploadField", () => {
  it("renders an upload button", () => {
    const field: FileUploadFieldProps = {
      type: "file",
      name: "test",
      mode: "file",
      value: "",
    };

    renderFormField(FileUploadField, field);

    const uploadButton = screen.getByText("Upload a file");
    expect(uploadButton).toBeInTheDocument();
  });

  // it("updates the form state when a file is uploaded", async () => {
  //   const field = { type: "file", name: "test", mode: "file" };
  //   const { result } = renderHook(() => useForm());
  //   render(<TestForm field={field} form={result.current} />);
  //   const file = new File(["test"], "test.txt", { type: "text/plain" });
  //   const inputElement = screen.getByRole("button", { name: "Upload a file" });
  //   Object.defineProperty(inputElement, "files", {
  //     value: [file],
  //   });
  //   fireEvent.change(inputElement);

  //   expect(result.current.getValues(field.name)).toBeInstanceOf(File);
  // });
});
