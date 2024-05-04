import * as LabelPrimitive from "@radix-ui/react-label";
import { Slot } from "@radix-ui/react-slot";
import * as React from "react";
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  FormProvider,
  useFormContext,
} from "react-hook-form";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { cn } from "#/lib/utils";
import { Label } from "#/components/ui/Label";
import { Tooltip } from "#/components/ui";
import { useRailsApp } from "#/components/RailsApp";

// Create separate contexts for form field state and updater
const FormFieldStateContext = React.createContext<
  FormFieldContextValue | undefined
>(undefined);
const FormFieldUpdaterContext = React.createContext<
  React.Dispatch<React.SetStateAction<FormFieldContextValue>> | undefined
>(undefined);

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

const Form = ({
  children,
  className = "",
  action = undefined,
  method = undefined,
  onSubmit = () => {},
  encType = "application/x-www-form-urlencoded",
  ...props
}: {
  action?: string;
  children: React.ReactNode;
  className?: string;
  encType?: "application/x-www-form-urlencoded" | "multipart/form-data";
  method?: "get" | "post";
  onSubmit?: React.FormEventHandler<HTMLFormElement> | (() => void);
}) => {
  const { csrfToken } = useRailsApp();

  return (
    // @ts-expect-error TS(2740) FIXME: Type '{ children: Element; }' is missing the follo... Remove this comment to see the full error message
    <FormProvider {...props}>
      <form
        action={action}
        method={method}
        className={className}
        encType={encType}
        onSubmit={onSubmit}
      >
        {children}
        {csrfToken && (
          <input
            type="hidden"
            name="authenticity_token"
            value={csrfToken}
            data-testid="csrf-token"
          />
        )}
      </form>
    </FormProvider>
  );
};

// Create a provider component for form field context
export const FormFieldProvider = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  children,
  ...props
}: React.PropsWithChildren<ControllerProps<TFieldValues, TName>>) => {
  const [fieldState, setFieldState] = React.useState<FormFieldContextValue>({
    name: props.name,
  });

  return (
    <FormFieldStateContext.Provider value={fieldState}>
      <FormFieldUpdaterContext.Provider value={setFieldState}>
        {children}
      </FormFieldUpdaterContext.Provider>
    </FormFieldStateContext.Provider>
  );
};

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => (
  <FormFieldProvider {...props}>
    <Controller {...props} />
  </FormFieldProvider>
);

// Use hooks to access form field state and updater
export const useFormFieldState = () => {
  const fieldState = React.useContext(FormFieldStateContext);
  if (typeof fieldState === "undefined") {
    throw new Error(
      "useFormFieldState must be used within a FormFieldProvider"
    );
  }
  return fieldState;
};

export const useFormFieldUpdater = () => {
  const setFieldState = React.useContext(FormFieldUpdaterContext);
  if (typeof setFieldState === "undefined") {
    throw new Error(
      "useFormFieldUpdater must be used within a FormFieldProvider"
    );
  }
  return setFieldState;
};

// Create separate contexts for form item state and updater
const FormItemStateContext = React.createContext<
  FormItemContextValue | undefined
>(undefined);
const FormItemUpdaterContext = React.createContext<
  React.Dispatch<React.SetStateAction<FormItemContextValue>> | undefined
>(undefined);

type FormItemContextValue = {
  id: string;
};

// Create a provider component for form item context
export const FormItemProvider = ({
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const [itemState, setItemState] = React.useState<FormItemContextValue>({
    id: React.useId(),
  });

  return (
    <FormItemStateContext.Provider value={itemState}>
      <FormItemUpdaterContext.Provider value={setItemState}>
        <div {...props}>{children}</div>
      </FormItemUpdaterContext.Provider>
    </FormItemStateContext.Provider>
  );
};

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <FormItemProvider>
    <div ref={ref} className={cn("space-y-2", className)} {...props} />
  </FormItemProvider>
));
FormItem.displayName = "FormItem";

// Use hooks to access form item state and updater
const useFormItemState = () => {
  const itemState = React.useContext(FormItemStateContext);
  if (typeof itemState === "undefined") {
    throw new Error("useFormItemState must be used within a FormItemProvider");
  }
  return itemState;
};

// const useFormItemUpdater = () => {
//   const setItemState = React.useContext(FormItemUpdaterContext);
//   if (typeof setItemState === "undefined") {
//     throw new Error(
//       "useFormItemUpdater must be used within a FormItemProvider"
//     );
//   }
//   return setItemState;
// };

const useFormField = () => {
  const fieldState = useFormFieldState();
  const itemState = useFormItemState();
  const { getFieldState, formState } = useFormContext();

  const fieldStateFromForm = getFieldState(fieldState.name, formState);

  if (!fieldState) {
    throw new Error("useFormField should be used within <FormField>");
  }

  const { id } = itemState;

  return {
    id,
    name: fieldState.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldStateFromForm,
  };
};

const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & {
    tooltip?: string;
  }
>(({ className, tooltip, ...props }, ref) => {
  const { error, formItemId } = useFormField();

  const label = (
    <Label
      ref={ref}
      className={cn(error && "text-destructive", className)}
      htmlFor={formItemId}
      {...props}
    />
  );
  return tooltip ? (
    <Tooltip content={tooltip} className="flex items-center gap-x-2">
      <div className="inline-flex space-x-1">
        {label} <InfoCircledIcon />
      </div>
    </Tooltip>
  ) : (
    label
  );
});
FormLabel.displayName = "FormLabel";

const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } =
    useFormField();

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  );
});
FormControl.displayName = "FormControl";

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField();

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
});
FormDescription.displayName = "FormDescription";

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message) : children;

  if (!body) {
    return null;
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn("text-destructive text-sm font-medium", className)}
      {...props}
    >
      {body}
    </p>
  );
});
FormMessage.displayName = "FormMessage";

export {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
};
