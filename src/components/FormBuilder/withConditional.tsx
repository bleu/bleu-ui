import React from "react";
import { evaluateConditions } from "./evaluateConditions";
import { BaseField, CommonFieldProps } from "./types";

export function withConditional<T extends BaseField>(
  Component: React.ComponentType<CommonFieldProps<T>>
) {
  return (props: CommonFieldProps<T>) => {
    const { form, field } = props;

    const shouldRender = evaluateConditions(
      form,
      field?.conditions,
      field?.index
    );

    if (!shouldRender) return null;

    return <Component {...props} />;
  };
}
