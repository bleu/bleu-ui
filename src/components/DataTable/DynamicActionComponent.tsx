/* eslint-disable no-case-declarations */
import React from "react";
import { useForm } from "react-hook-form";
import { Trans } from "react-i18next";
import { ClickToCopy } from "#/components/CopyClipboard";
import { Link } from "../Link";
import { SubmitButton } from "#/components/SubmitButton";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "#/components/ui/AlertDialog";
import { Button } from "#/components/ui/Button";
import { Dialog, DialogContent, DialogTrigger } from "../ui/Dialog";
import { Form } from "../ui/Form";
import { buildForm } from "../FormBuilder/buildForm";

export const DynamicActionComponent = ({ action, row }) => {
  const renderActionButton = () => {
    switch (action.type) {
      case "link":
        return (
          <Link to={action.url_path.replace("RESOURCE_ID", row.original.id)}>
            <Button variant="ghost" className="w-full text-sm">
              {action.name}
            </Button>
          </Link>
        );
      case "copy":
        const key = action.content?.key;
        const value = row.original?.[key];

        if (!value) return null;

        return (
          <Button variant="ghost" className="w-full">
            <ClickToCopy text={value}>
              <span>{action.name}</span>
            </ClickToCopy>
          </Button>
        );
      case "form":
        return <ActionForm action={action} row={row} />;
      default:
        return null;
    }
  };

  return renderActionButton();
};

interface ActionFormProps {
  action: {
    form?: any;
    method: string;
    name: string;
    trigger_confirmation: boolean;
    url_path: string;
  };
  children?: React.ReactNode;
  row: {
    original: {
      id: string;
    };
  };
}

export const ActionForm: React.FC<ActionFormProps> = ({
  action,
  row,
  children,
}) => {
  const form = useForm({});
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  if (action?.form?.fields) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          {children || (
            <Button variant="ghost" className="w-full">
              {action.name}
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="max-h-[100%] max-w-lg overflow-auto">
          <div className="px-2 flex flex-col">
            <span className="text-xl font-semibold text-foreground mb-2">
              {action.name}
            </span>
            <span className="text-sm text-muted-foreground">
              <Trans>Fill in the fields to confirm the action</Trans>
            </span>
          </div>
          <Form
            onSubmit={() => setIsSubmitting(true)}
            action={action.url_path.replace("RESOURCE_ID", row.original.id)}
            method="post"
            {...form}
          >
            <div className="p-2">
              {action.method === "delete" && (
                <input type="hidden" name="_method" value="delete" />
              )}
              <div className="flex flex-wrap gap-4">
                {buildForm(action?.form?.fields, form)}
              </div>
              <div className="flex justify-start mt-4">
                <SubmitButton type="submit" isSubmitting={isSubmitting}>
                  <Trans>Confirm</Trans>
                </SubmitButton>
              </div>
            </div>
          </Form>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      {action?.trigger_confirmation && (
        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <AlertDialogTrigger asChild>
            {children || (
              <Button variant="ghost" className="w-full">
                {action.name}
              </Button>
            )}
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                <Trans>Are you sure?</Trans>
              </AlertDialogTitle>
              <AlertDialogDescription>
                <Trans>This action cannot be undone.</Trans>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>
                <Trans>Cancel</Trans>
              </AlertDialogCancel>
              <Form
                onSubmit={() => setIsSubmitting(true)}
                action={action.url_path.replace("RESOURCE_ID", row.original.id)}
                method="post"
                {...form}
              >
                {action.method === "delete" && (
                  <input type="hidden" name="_method" value="delete" />
                )}
                <SubmitButton type="submit" isSubmitting={isSubmitting}>
                  <Trans>Confirm</Trans>
                </SubmitButton>
              </Form>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
      {!action?.trigger_confirmation && (
        <Form
          action={action.url_path.replace("RESOURCE_ID", row.original.id)}
          method="post"
          {...form}
        >
          {action.method === "delete" && (
            <input type="hidden" name="_method" value="delete" />
          )}
          <Button variant="ghost" className="w-full" type="submit">
            {action.name}
          </Button>
        </Form>
      )}
    </>
  );
};
