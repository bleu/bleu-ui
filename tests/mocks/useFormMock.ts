import { vi } from "vitest";

const useFormMock = () => ({
  watch: vi.fn(),
  setValue: vi.fn(),
  getValues: vi.fn(),
  handleSubmit: vi.fn(),
  reset: vi.fn(),
  formState: {
    errors: {},
  },
});

export default useFormMock;
