import { MoveIcon, TrashIcon } from "@radix-ui/react-icons";
import React from "react";
import { DragDropContext, Draggable } from "react-beautiful-dnd";
import { useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { StrictModeDroppable } from "@/components/StrictModeDroppable";

import { buildForm } from "../builder";
import {
  BaseField,
  FormFieldProps,
  parseFields,
  withConditional,
} from "../fields";

export interface QuestionsFieldProps extends BaseField {
  _destroy?: boolean;
  defaultValues: Record<string, unknown>;
  fields: Array<FormFieldProps>;
  hasSequence: boolean;
  remove?: boolean;
  sequence_field?: string;
}

export const QuestionsField = withConditional<QuestionsFieldProps>(
  ({ form, field }) => {
    const {
      fields: fieldsArray,
      append,
      remove,
      move,
    } = useFieldArray({
      control: form.control,
      name: field.name,
    });

    const updateFieldSequences = () => {
      if (!field.hasSequence) return;

      const updatedFields = form.getValues(field.name);
      updatedFields.forEach((_, index) => {
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
      append({ ...field.defaultValues });
      updateFieldSequences();
    };

    const handleRemove = (index) => {
      const fields = form.getValues(field.name);
      const fieldToRemove = fields[index];

      if (fieldToRemove.id) {
        const updatedField = { ...fieldToRemove, _destroy: true };
        const newFields = fields.map((f, idx) =>
          idx === index ? updatedField : f
        );
        form.setValue(field.name, newFields);
      } else {
        remove(index);
      }
    };

    return (
      <div className="w-full">
        <div className="mr-2 flex flex-col gap-10">
          {/* @ts-expect-error */}
          <DragDropContext onDragEnd={handleDrag}>
            <ul>
              <StrictModeDroppable droppableId={`${field.name}-sub-items`}>
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {fieldsArray.map((rhfField, index) => {
                      // @ts-expect-error
                      // eslint-disable-next-line no-underscore-dangle
                      if (rhfField._destroy) return null;

                      return (
                        // @ts-expect-error
                        <Draggable
                          // eslint-disable-next-line react/no-array-index-key
                          key={`${field.name}[${index}]`}
                          draggableId={`sub-item-${index}`}
                          index={index}
                        >
                          {/* eslint-disable-next-line no-shadow */}
                          {(provided) => (
                            <li
                              key={rhfField.id}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className="mb-3"
                            >
                              <div
                                className="flex flex-col gap-2 rounded-sm border p-3"
                                key={rhfField.id}
                              >
                                {field.remove !== false && (
                                  // eslint-disable-next-line jsx-a11y/control-has-associated-label
                                  <button
                                    type="button"
                                    onClick={() => handleRemove(Number(index))}
                                    className="mt-2"
                                  >
                                    <TrashIcon className="size-6" />
                                  </button>
                                )}
                                {buildForm(
                                  JSON.parse(
                                    JSON.stringify(
                                      parseFields(field.fields, index)
                                    )
                                  ),
                                  form,
                                  index
                                )}
                                {field.hasSequence && (
                                  <div
                                    className="size-6"
                                    {...provided.dragHandleProps}
                                  >
                                    <MoveIcon className="size-6" />
                                  </div>
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
        <Button type="button" onClick={handleAppend} className="mt-3">
          Add {field.label}
        </Button>
      </div>
    );
  }
);
