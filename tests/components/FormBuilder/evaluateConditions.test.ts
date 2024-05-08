import { vi, describe, it, expect, beforeEach } from "vitest";
import useFormMock from "../../mocks/useFormMock";
import { evaluateConditions } from "#/components/FormBuilder/evaluateConditions";

// Mock useForm using vi.mock if react-hook-form is imported elsewhere in the tested module
vi.mock("react-hook-form", () => ({
  useForm: useFormMock,
}));

describe("evaluateConditions", () => {
  let mockForm;

  beforeEach(() => {
    // Reset and configure the default behavior of the useForm mock before each test
    mockForm = useFormMock();
    mockForm.watch.mockImplementation((field) => {
      const values = { age: "30", status: "active" };
      return values[field];
    });
  });

  it("returns true when no conditions are provided", () => {
    expect(evaluateConditions(mockForm, undefined)).toBe(true);
  });

  it("correctly evaluates 'allOf' conditions", () => {
    const conditions = { allOf: [{ age: ["30"] }, { status: ["active"] }] };
    expect(evaluateConditions(mockForm, conditions)).toBe(true);
  });

  // Additional tests...
});
