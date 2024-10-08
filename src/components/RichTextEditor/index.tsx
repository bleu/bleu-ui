import "./styles.css";

import React, { Suspense, lazy } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useTheme } from "#/components/ThemeToggle/context";

const JoditEditor = lazy(() => import("./JoditEditor"));

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

export default function RichTextEditor({ initialValue, onChange }) {
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <div>
      <Suspense fallback={<Trans>Loading</Trans>}>
        <JoditEditor
          value={initialValue}
          config={{
            // @ts-ignore
            placeholder: t("Start writing"),
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
      </Suspense>
    </div>
  );
}
