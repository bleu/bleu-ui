import React, { useEffect } from "react";
import { cva } from "class-variance-authority";
import { DragDropContext, Draggable } from "react-beautiful-dnd";
import { useFieldArray } from "react-hook-form";
import { MoveIcon, TrashIcon } from "@radix-ui/react-icons";
import { StrictModeDroppable } from "@/components/StrictModeDroppable";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

import { buildForm } from "../builder";
import { BaseField, FormFieldProps, withConditional } from "../fields";

const fieldArrayVariants = cva("w-full", {
  variants: {
    layout: {
      stack: "flex flex-col justify-between items-start",
      inline: "flex flex-row justify-between items-center",
    },
    border: {
      none: "",
      normal: "border px-5 py-3 rounded-md shadow-sm",
    },
    gap: {
      small: "gap-1",
      medium: "gap-2",
      large: "gap-4",
    },
  },
  defaultVariants: {
    layout: "inline",
    border: "none",
    gap: "medium",
  },
});
export interface FieldArrayFieldProps extends BaseField {
  _destroy?: boolean;
  defaultValues: Record<string, unknown>;
  fields: Array<FormFieldProps>;
  hasSequence: boolean;
  length?: {
    maximum?: number;
    minimum?: number;
  };
  remove?: boolean;
  sequence_field?: string;
  style?: {
    border?: "none" | "normal";
    gap?: "small" | "medium" | "large";
    layout?: "stack" | "inline";
  };
  type: "field_array";
}

export const FieldArray = withConditional<FieldArrayFieldProps>(
  ({ form, field }) => {
    const { fields, append, remove, move } = useFieldArray({
      control: form.control,
      name: field.name,
    });

    const updateFieldSequences = () => {
      if (!field.hasSequence) return;

      const updatedFields = form.getValues(field.name);
      updatedFields.forEach((item, index) => {
        form.setValue(
          `${field.name}[${index}].${field.sequence_field || "sequence"}`,
          index
        );
      });
    };

    const handleDrag = ({ source, destination }) => {
      if (!destination) return;

      move(source.index, destination.index);
      updateFieldSequences();
    };

    const handleAppend = () => {
      append({ ...field.defaultValues }, { shouldFocus: false });
      updateFieldSequences();
    };

    const handleRemove = (index) => {
      const fieldArray = form.getValues(field.name);
      const fieldToRemove = fieldArray[index];

      if (fieldToRemove.id) {
        const updatedField = { ...fieldToRemove, _destroy: true };
        const newFields = fieldArray.map((f, idx) =>
          idx === index ? updatedField : f
        );
        form.setValue(field.name, newFields);
      } else {
        remove(index);
      }
    };

    useEffect(() => {
      adjustFieldsLenghtToMaximum();
      adjustFieldsLenghtToMinimum();
    }, [field?.length]);

    function adjustFieldsLenghtToMaximum() {
      if (field?.length?.maximum && fields.length > field?.length.maximum) {
        const newFields = fields.slice(0, field?.length.maximum);
        form.setValue(field.name, newFields);
      }
    }

    function adjustFieldsLenghtToMinimum() {
      if (field?.length?.minimum && fields.length < field?.length?.minimum) {
        const emptyFields = new Array(
          field.length.minimum - fields.length
        ).fill(field.defaultValues);
        append(emptyFields, { shouldFocus: false });
      }
    }

    return (
      <div className="w-full">
        <div className="mr-10">
          {/* @ts-expect-error */}
          <DragDropContext onDragEnd={handleDrag}>
            <ul>
              <StrictModeDroppable droppableId={`${field.name}-items`}>
                {/* eslint-disable-next-line no-shadow, @typescript-eslint/no-unused-vars */}
                {(provided, snapshot) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {fields.map((rhfField, index) => {
                      // @ts-expect-error
                      // eslint-disable-next-line no-underscore-dangle
                      if (rhfField._destroy) return null;
                      return (
                        // @ts-expect-error
                        <Draggable
                          key={`${field.name}[${rhfField.id}]`}
                          draggableId={`item-${index}`}
                          index={index}
                        >
                          {/* eslint-disable-next-line no-shadow, @typescript-eslint/no-unused-vars */}
                          {(provided, snapshot) => (
                            <li
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className="mb-3"
                            >
                              <div
                                className={cn(fieldArrayVariants(field.style))}
                              >
                                {field.hasSequence && (
                                  <div
                                    className="flex h-full w-6 flex-col justify-center"
                                    {...provided.dragHandleProps}
                                  >
                                    <MoveIcon className="size-6 self-center" />
                                  </div>
                                )}
                                {buildForm(field.fields, form, Number(index))}
                                {field.remove !== false && (
                                  // eslint-disable-next-line jsx-a11y/control-has-associated-label
                                  <button
                                    type="button"
                                    onClick={() => handleRemove(Number(index))}
                                    className="mt-4"
                                  >
                                    <TrashIcon className="size-6" />
                                  </button>
                                )}
                              </div>
                            </li>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder as React.ReactElement}
                  </div>
                )}
              </StrictModeDroppable>
            </ul>
          </DragDropContext>
        </div>
        <Button
          type="button"
          onClick={handleAppend}
          className="mt-3"
          disabled={
            field?.length?.maximum !== undefined &&
            fields.length >= field?.length?.maximum
          }
        >
          Add {field.label}
        </Button>
      </div>
    );
  }
);
