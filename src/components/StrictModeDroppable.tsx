// https://github.com/atlassian/react-beautiful-dnd/issues/2350
// https://github.com/atlassian/react-beautiful-dnd/issues/2399#issuecomment-1175638194

import React, { useEffect, useState } from "react";
import { Droppable, DroppableProps } from "react-beautiful-dnd";

export const StrictModeDroppable = ({ children, ...props }: DroppableProps) => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));

    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);

  if (!enabled) {
    return null;
  }

  // @ts-ignore
  return <Droppable {...props}>{children}</Droppable>;
};
