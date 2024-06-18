// import { describe, it, expect, vi } from "vitest";
// import { act } from "@testing-library/react";
// import { renderFormField } from "tests/helpers/renderFormField";
// import {
//   RichTextEditorField,
//   RichTextEditorFieldProps,
// } from "#/components/FormBuilder/fields/RichTextEditorField";

// describe("RichTextEditorField", () => {
//   const field: RichTextEditorFieldProps = {
//     type: "wysiwyg",
//     name: "test",
//     value: "",
//   };

//   beforeEach(async () => {
//     renderFormField(RichTextEditorField, field);
//     await act(() => vi.dynamicImportSettled());
//     await act(() => vi.dynamicImportSettled());
//   });

//   it("renders a rich text editor", async () => {
//     const { container } = renderFormField(RichTextEditorField, field);
//     const editorElement = container.querySelector(".jodit-wysiwyg");
//     expect(editorElement).not.toBeNull();
//   });

//   it("updates the form state when the editor content changes", async () => {
//     const { form, container } = renderFormField(RichTextEditorField, field);
//     const editorElement = container.querySelector(".jodit-wysiwyg");

//     if (!editorElement) {
//       throw new Error("Editor element not found");
//     }

//     await act(async () => {
//       editorElement.innerHTML = "<p>Test content</p>";
//       editorElement.dispatchEvent(new Event("blur"));
//     });

//     expect(form.getValues("test")).toBe("<p>Test content</p>");
//   });
// });
