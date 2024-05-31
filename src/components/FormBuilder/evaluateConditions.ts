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

  if (Object.keys(conditions).length === 0) return true;
  const key = Object.keys(conditions)[0];
  const watchField = form.watch(key.replace("RESOURCE_ID", String(index)));
  const values = conditions[key];

  if (!Array.isArray(values)) {
    return values === watchField;
  }
  return values.includes(watchField);
};
