import React from "react";
import { useNavigation } from "react-router-dom";
import { Button, ButtonProps } from "./ui/Button";

export interface SubmitButtonProps extends ButtonProps {
  isSubmitting?: boolean;
  submittingText?: string;
}

export const SubmitButton = React.forwardRef<
  HTMLButtonElement,
  SubmitButtonProps
>(({ isSubmitting = false, submittingText = "Saving...", ...props }, ref) => {
  const { state } = useNavigation();

  return (
    <Button
      ref={ref}
      {...props}
      loadingText={submittingText}
      loading={isSubmitting || state === "submitting"}
    />
  );
});
