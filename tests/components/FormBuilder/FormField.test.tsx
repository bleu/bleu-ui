// FormField.test.tsx
import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, renderHook, screen } from "@testing-library/react";
import { FormProvider, useForm } from "react-hook-form";
import { FormField } from "#/components";

describe("FormField", () => {
  const renderFormField = (props) => {
    const { result } = renderHook(() => useForm());
    return (
      <FormProvider {...result.current}>
        <FormField {...props} />
      </FormProvider>
    );
  };

  // it("renders the correct error message when validation fails", async () => {
  //   render(
  //     renderFormField({
  //       name: "test",
  //       rules: { required: "Field is required" },
  //       render: ({ field }) => <input {...field} />,
  //     })
  //   );
  //   const inputElement = screen.getByRole("textbox");
  //   fireEvent.blur(inputElement);
  //   const errorMessage = await screen.findByRole("alert");
  //   expect(errorMessage).toHaveTextContent("Field is required");
  // });

  it("renders the appropriate field component based on the render prop", () => {
    render(
      renderFormField({
        name: "test",
        render: ({ field }) => <input {...field} placeholder="Enter text" />,
      })
    );
    const inputElement = screen.getByPlaceholderText("Enter text");
    expect(inputElement).toBeInTheDocument();
  });

  it("passes the correct props to the render function", () => {
    const renderMock = vi.fn();
    render(renderFormField({ name: "test", render: renderMock }));
    expect(renderMock).toHaveBeenCalledWith(
      expect.objectContaining({
        field: expect.any(Object),
        fieldState: expect.any(Object),
        formState: expect.any(Object),
      })
    );
  });
});
