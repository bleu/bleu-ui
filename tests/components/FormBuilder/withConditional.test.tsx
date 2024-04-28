import * as React from "react";
import { describe, it, expect } from "vitest";
import { render, renderHook, screen } from "@testing-library/react";
import { useForm } from "react-hook-form";
import { withConditional } from "#/components";

describe("withConditional", () => {
  const TestComponent = () => <div>Test</div>;
  const ConditionalComponent = withConditional(TestComponent);

  it("renders the wrapped component when conditions are satisfied", () => {
    const field = {
      name: "test",
      type: "input",
      value: "",
      conditions: [{ name: "test", value: "value" }],
    };
    const form = renderHook(() =>
      useForm({
        defaultValues: { test: "value" },
      })
    ).result.current;
    // @ts-expect-error TS(2345) FIXME: Argument of type 'React.ComponentType<CommonFieldProps<BaseField>>' is not assignable to parameter of type 'React.ComponentType<CommonFieldProps<BaseField>>'.
    render(<ConditionalComponent field={field} form={form} />);
    const testElement = screen.getByText("Test");
    expect(testElement).toBeInTheDocument();
  });

  it("does not render the wrapped component when conditions are not satisfied", () => {
    const field = {
      name: "test",
      type: "input",
      value: "",
      conditions: [{ name: "test", value: "value" }],
    };
    const form = renderHook(() => useForm()).result.current;
    render(<ConditionalComponent field={field} form={form} />);
    const testElement = screen.queryByText("Test");
    expect(testElement).not.toBeInTheDocument();
  });
});
