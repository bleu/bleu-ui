import React, { useEffect } from "react";
import { FormControl, FormField } from "#/components/ui/Form";

import { withConditional } from "../withConditional";
import { BaseField } from "../types";

export interface DelegateFieldProps extends BaseField {
  delegateKey: string;
  options: Array<{
    delegateValue: string;
    value: string;
  }>;
}

export const DelegateField = withConditional<DelegateFieldProps>(
  ({ form, field }) => {
    const delegateKey = field.delegateKey.replace(
      "RESOURCE_ID",
      String(field.index)
    );

    useEffect(() => {
      const delegated = field.options.find(
        (option) => option.value === form.watch(delegateKey)
      );
      form.setValue(field.name, delegated?.delegateValue);
    }, [form.watch(delegateKey)]);

    return (
      <FormField
        control={form.control}
        name={field.name}
        defaultValue={field.value}
        render={({ field: formField }) => (
          <FormControl>
            <input type="hidden" {...formField} />
          </FormControl>
        )}
      />
    );
  }
);
