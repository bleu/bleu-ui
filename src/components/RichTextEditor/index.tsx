import "./quillOverride.css";

import htmlEditButton from "quill-html-edit-button";
import React from "react";
import ReactQuill, { Quill } from "react-quill";

export function RichTextEditor({ initialValue, onChange }) {
  Quill.register({
    "modules/htmlEditButton": htmlEditButton,
  });

  const toolbar = [
    [{ font: [] }, { size: [] }],
    [{ header: [] }, "blockquote", "code-block"],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["direction", { align: [] }],
    [{ script: "super" }, { script: "sub" }],
    ["link", "image", "video"],
    ["clean"],
  ];

  return (
    <div className="bg-background max-w-[1336px] rounded-lg border shadow-sm">
      <ReactQuill
        theme="snow"
        value={initialValue}
        onChange={onChange}
        modules={{
          htmlEditButton: {},
          toolbar,
        }}
      />
    </div>
  );
}
