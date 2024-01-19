import React from "react";
import { FormControl, FormField } from "@/components/ui/Form";

import { withConditional } from "../fields";

export const HiddenField = withConditional(({ form, field }) => (
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
));
