import React from "react";
import { expect, afterEach, vi } from "vitest";
import { cleanup, renderHook } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";

declare module "vitest" {
  interface Assertion<T = any>
    extends jest.Matchers<void, T>,
      matchers.TestingLibraryMatchers<T, void> {}
}
const mockI18n = () => {
  vi.mock("react-i18next", () => ({
    // Mock hook
    useTranslation: () => ({
      t: (k: string) => k,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    }),
    // High Order Component as a function returning a function
    withTranslation: () => (Component) => (props) =>
      React.createElement(Component, { ...props, t: (k) => k }),
    // Trans component as a functional component
    Trans: ({ children, i18nKey }) => children || i18nKey,
    // Provider can be simplified to just return children for testing purposes
    I18nextProvider: ({ children }) => children,
    initReactI18next: {
      type: "3rdParty",
      init: vi.fn(),
    },
  }));
};

expect.extend(matchers);

beforeEach(() => {
  mockI18n();
});

afterEach(() => {
  cleanup();
});

const suppressConsoleError = () => {
  const logSpy = vi.spyOn(console, "log").mockImplementation(() => undefined);
  const errorSpy = vi
    .spyOn(console, "error")
    .mockImplementation(() => undefined);

  return () => {
    errorSpy.mockRestore();
    logSpy.mockRestore();
  };
};

export const renderHookWithError = (...args: unknown[]) => {
  let error: unknown;
  const restore = suppressConsoleError();

  try {
    // @ts-ignore
    renderHook(...args);
  } catch (ex) {
    error = ex;
  }

  restore();
  throw error;
};
