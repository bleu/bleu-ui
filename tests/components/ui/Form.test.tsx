import { render, screen, fireEvent } from "@testing-library/react";
import * as React from "react";
import { useForm } from "react-hook-form";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "#/components/ui/Form";

vi.mock("#/components//RailsApp/context", async () => {
  const mod = await vi.importActual("#/components/RailsApp/context");
  return {
    ...mod,
    useRailsApp: () => ({
      csrfToken: "mocked-csrf-token",
    }),
  };
});

vi.mock("#/components/ui/Tooltip", () => ({
  Tooltip: ({ children }) => <div>{children}</div>,
}));

const TestForm = () => {
  const form = useForm();

  return (
    <Form {...form}>
      <FormField
        name="testField"
        rules={{ required: "Field is required" }}
        defaultValue=""
        render={({ field }) => (
          <FormItem>
            <FormLabel>Test Field</FormLabel>
            <FormControl>
              <input {...field} />
            </FormControl>
            <FormDescription>This is a test field</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <button type="submit">Submit</button>
    </Form>
  );
};

describe("Form Components", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the form correctly", () => {
    render(<TestForm />);
    expect(screen.getByText("Test Field")).toBeInTheDocument();
    expect(screen.getByText("This is a test field")).toBeInTheDocument();
    expect(screen.getByText("Submit")).toBeInTheDocument();
  });

  // it("displays error message when field is invalid", async () => {
  //   render(<TestForm />);
  //   fireEvent.submit(screen.getByText("Submit"));
  //   expect(await screen.findByRole("alert")).toHaveTextContent(
  //     "Field is required"
  //   );
  // });

  it("passes validation when field is valid", async () => {
    render(<TestForm />);
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "Valid input" },
    });
    fireEvent.submit(screen.getByText("Submit"));
    expect(screen.queryByText("Field is required")).not.toBeInTheDocument();
  });

  it("renders the CSRF token input", () => {
    render(<TestForm />);
    expect(screen.getByTestId("csrf-token")).toHaveValue("mocked-csrf-token");
  });
});
