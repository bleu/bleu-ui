import { FieldValues, UseFormReturn } from "react-hook-form";

export interface Conditions {
  [key: string]: any;
  allOf?: Conditions[];
  anyOf?: Conditions[];
}

export const evaluateConditions = (
  form: UseFormReturn<FieldValues>,
  conditions: Conditions | undefined,
  index?: number
): boolean => {
  if (!conditions) return true;

  if (conditions.allOf) {
    return conditions.allOf.every((cond) =>
      evaluateConditions(form, cond, index)
    );
  }

  if (conditions.anyOf) {
    return conditions.anyOf.some((cond) =>
      evaluateConditions(form, cond, index)
    );
  }

  return Object.entries(conditions).every(([key, values]) => {
    if (key === "allOf" || key === "anyOf") return true;
    const actualKey = key.replace("RESOURCE_ID", String(index));
    const watchField = form.watch(actualKey);
    return values.includes(watchField);
  });
};
