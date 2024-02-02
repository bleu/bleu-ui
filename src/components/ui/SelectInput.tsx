import React from "react";

import * as Select from "@/components/ui/Select";

const SelectInput = ({ label, name, options, onValueChange }) => (
  <div className="flex w-full flex-col items-start justify-start">
    <label className="block text-sm text-gray-800" htmlFor={name}>
      {label}
      <Select.SelectRoot onValueChange={onValueChange} name={name}>
        <Select.SelectTrigger className="h-[35px] inline-flex w-full items-center justify-start gap-[5px] rounded bg-white">
          <Select.SelectValue />
        </Select.SelectTrigger>
        <Select.SelectContent className="z-[10000] w-full overflow-hidden rounded-md bg-white text-gray-900">
          <Select.SelectGroup>
            <Select.SelectLabel className="pl-4" />
            {options.map((option) => (
              <Select.SelectItem
                key={option.id}
                value={option.id.toString()}
                className="relative flex select-none items-center bg-white leading-none text-gray-900 data-[highlighted]:bg-gray-300 data-[highlighted]:font-semibold data-[disabled]:text-gray-400 data-[highlighted]:outline-none"
              >
                {option.value}
              </Select.SelectItem>
            ))}
          </Select.SelectGroup>
        </Select.SelectContent>
      </Select.SelectRoot>
    </label>
  </div>
);

export { SelectInput };
