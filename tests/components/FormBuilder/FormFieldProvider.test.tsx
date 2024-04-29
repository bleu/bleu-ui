// import * as React from "react";
// import { describe, it, expect } from "vitest";
// import { render, screen, renderHook } from "@testing-library/react";
// import {
//   FormFieldProvider,
//   useFormFieldState,
//   useFormFieldUpdater,
// } from "#/components";

// describe("FormFieldProvider", () => {
//   it("correctly initializes the field state with the provided name", () => {
//     render(
//       <FormFieldProvider
//         name="test"
//         render={({ field }) => <div {...field} data-testid="child" />}
//       />
//     );
//     const childElement = screen.getByTestId("child");
//     expect(childElement).toBeInTheDocument();
//   });

//   it("provides the field state and updater function to its children", () => {
//     const { result } = renderHook(
//       () => {
//         const fieldState = useFormFieldState();
//         const setFieldState = useFormFieldUpdater();
//         return { fieldState, setFieldState };
//       },
//       {
//         wrapper: ({ children }) => (
//           <FormFieldProvider
//             name="test"
//             render={({ field }) => <div>{children}</div>}
//           />
//         ),
//       }
//     );
//     expect(result.current.fieldState.name).toBe("test");
//     expect(typeof result.current.setFieldState).toBe("function");
//   });
// });
