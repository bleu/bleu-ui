import { cva } from "class-variance-authority";
import React, { useCallback, useEffect } from "react";
import { Cross1Icon } from "@radix-ui/react-icons";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import { cn } from "@/lib/utils";

import { BaseField, withConditional } from "../fields";

const imageUploadVariants = cva("w-full", {
  variants: {
    size: {
      small: "size-24 p-0",
      medium: "size-48 p-0",
      large: "size-80 p-0",
    },
  },
  defaultVariants: {
    size: "medium",
  },
});

export interface ImageUploadFieldProps extends BaseField {
  style?: {
    size?: "small" | "medium" | "large";
  };
  type: "image";
}

export const ImageUploadField = withConditional<ImageUploadFieldProps>(
  ({ form, field }) => {
    const [imagePreview, setImagePreview] = React.useState<string>("");
    const hiddenFileInput = React.useRef<HTMLInputElement>(null);

    useEffect(() => {
      const value = form.getValues(field.name);
      if (!value) return;

      setImagePreview(value);
    }, []);

    const onUpload = useCallback((event) => {
      if (!event.target.files?.length) return;

      const file = event.target.files[0];
      setImagePreview(URL.createObjectURL(file?.url ? file.url : file));
      form.setValue(field.name, file);
    }, []);

    const handleClick = () => {
      if (hiddenFileInput.current) hiddenFileInput.current.click();
    };

    const handleRemoveImage = (event) => {
      event.stopPropagation();
      setImagePreview("");
      form.setValue(field.name, null);
    };

    return (
      <FormField
        control={form.control}
        name={field.name}
        rules={field.required ? { required: true } : undefined}
        render={({ field: formField }) => (
          <FormItem>
            <FormLabel>{field.label}</FormLabel>
            <FormDescription>{field.description}</FormDescription>
            <FormControl>
              <div
                className={cn(
                  imagePreview
                    ? "relative inline-block hover:cursor-pointer"
                    : "hover:border-primary focus:ring-primary relative flex w-full flex-col items-center rounded-lg border-2 border-dashed text-center focus:outline-none focus:ring-2 focus:ring-offset-2"
                )}
              >
                <button
                  type="button"
                  className={cn("w-full h-full p-12", {
                    [imageUploadVariants(field.style)]: imagePreview,
                  })}
                  onClick={handleClick}
                >
                  {imagePreview ? (
                    <div className="relative size-full">
                      <img
                        src={imagePreview}
                        alt="preview"
                        className="rounded-sm border size-full object-contain"
                      />
                      <button
                        type="button"
                        className="absolute top-0 right-0 m-2 z-50"
                        onClick={handleRemoveImage}
                        aria-label="Remove Image"
                      >
                        <Cross1Icon className="text-2xl font-semibold size-4" />
                      </button>
                      <div className="hover:ring-primary absolute inset-0 flex items-center justify-center rounded-sm bg-black/50 opacity-0 transition-opacity hover:opacity-100 hover:ring-2 hover:ring-offset-2">
                        <span className="text-lg font-semibold text-white">
                          Click to Upload
                        </span>
                      </div>
                    </div>
                  ) : (
                    <span className="text-lg font-semibold">Upload a file</span>
                  )}
                </button>
                <input
                  type="file"
                  onChange={onUpload}
                  accept="image/*"
                  name={formField.name}
                  ref={hiddenFileInput}
                  style={{ display: "none" }}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }
);
