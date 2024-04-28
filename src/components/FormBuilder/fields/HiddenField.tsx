import React from "react";
import { FormField, FormItem } from "#/components/ui/Form";

import { withConditional } from "../fields";

export const HiddenField = withConditional(({ form, field }) => (
  <FormField
    control={form.control}
    name={field.name}
    defaultValue={field.value}
    render={({ field: formField }) => (
      <FormItem>
        <input type="hidden" {...formField} />
      </FormItem>
    )}
  />
));
