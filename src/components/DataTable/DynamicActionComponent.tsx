/* eslint-disable no-case-declarations */
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  Form,
} from "@/components/ui";
import { ClickToCopy } from "@/components/CopyClipboard";

export const DynamicActionComponent = ({ action, row }) => {
  const navigate = useNavigate();

  const handleLinkAction = () => {
    navigate(action.url_path.replace("RESOURCE_ID", row.original.id));
  };

  const renderActionButton = () => {
    switch (action.type) {
      case "link":
        return (
          <Button variant="ghost" className="w-full" onClick={handleLinkAction}>
            {action.name}
          </Button>
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

const ActionForm = ({ action, row }) => {
  const form = useForm({});
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  // TODO: the styles here are a bit off, but it's a start
  return (
    <>
      {action?.trigger_confirmation && (
        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" className="w-full">
              {action.name}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <Form
                action={action.url_path.replace("RESOURCE_ID", row.original.id)}
                method="post"
                {...form}
              >
                {action.method === "delete" && (
                  <input type="hidden" name="_method" value="delete" />
                )}
                <Button type="submit">Confirm</Button>
              </Form>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
      {!action?.trigger_confirmation && (
        <Form action={action.url_path} method="post" {...form}>
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
