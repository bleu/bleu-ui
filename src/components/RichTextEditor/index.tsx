import "./styles.css";

import React, { lazy } from "react";
import { useTheme } from "@/components/ThemeToggle/context";

const JoditEditor = lazy(() => import("jodit-react"));

const EDITOR_BUTTONS = [
  "undo",
  "redo",
  "|",
  "bold",
  "strikethrough",
  "underline",
  "italic",
  "|",
  "superscript",
  "subscript",
  "|",
  "align",
  "|",
  "ul",
  "ol",
  "outdent",
  "indent",
  "|",
  "font",
  "fontsize",
  "brush",
  "paragraph",
  "|",
  "image",
  "link",
  "table",
  "|",
  "hr",
  "eraser",
  "copyformat",
  "|",
  "fullsize",
  "selectall",
  "print",
  "|",
  "source",
];

export function RichTextEditor({ initialValue, onChange }) {
  const { theme } = useTheme();

  return (
    <div>
      <JoditEditor
        value={initialValue}
        config={{
          readonly: false,
          height: 300,
          theme,
          toolbar: true,
          buttons: EDITOR_BUTTONS,
          // @ts-ignore
          uploader: {
            insertImageAsBase64URI: true,
          },
        }}
        onBlur={(content) => onChange(content)}
        onChange={() => {}}
      />
    </div>
  );
}
