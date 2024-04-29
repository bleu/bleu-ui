import { describe, it, expect, vi } from "vitest";
import { screen, act } from "@testing-library/react";
import { renderFormField } from "tests/helpers/renderFormField";
import { RichTextEditorField, RichTextEditorFieldProps } from "#/components";

describe("RichTextEditorField", () => {
  const field: RichTextEditorFieldProps = {
    type: "wysiwyg",
    name: "test",
    value: "",
  };

  it("renders a rich text editor", async () => {
    const { container } = renderFormField(RichTextEditorField, field);
    expect(screen.getByText("Loading")).toBeInTheDocument();
    await act(() => vi.dynamicImportSettled());
    expect(container.querySelector(".jodit-wysiwyg")).toBeInTheDocument();
  });

  it("updates the form state when the editor content changes", async () => {
    const { form, container } = renderFormField(RichTextEditorField, field);
    await act(() => vi.dynamicImportSettled());
    const editorElement = container.querySelector(".jodit-wysiwyg");

    if (!editorElement) {
      throw new Error("Editor element not found");
    }

    await act(async () => {
      editorElement.innerHTML = "<p>Test content</p>";
      editorElement.dispatchEvent(new Event("blur"));
    });

    expect(form.getValues("test")).toBe("<p>Test content</p>");
  });
});
