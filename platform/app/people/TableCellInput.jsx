"use client";

import { useRef } from "react";
import SaveWatcher from "./SaveWatcher";

// A spreadsheet-style cell: type, then either press Enter or click away
// (blur) and it saves - no visible Save button needed. Only submits if
// the value actually changed, so tabbing through untouched cells is free.
export default function TableCellInput({ action, id, name, defaultValue, placeholder, listId, type = "text" }) {
  const formRef = useRef(null);
  const initialValue = defaultValue || "";

  function handleBlur(e) {
    if (e.target.value !== initialValue) {
      formRef.current?.requestSubmit();
    }
  }

  return (
    <form ref={formRef} action={action} className="table-inline-form">
      <input type="hidden" name="id" value={id} />
      <input
        type={type}
        name={name}
        defaultValue={initialValue}
        placeholder={placeholder}
        className="table-cell-input"
        onBlur={handleBlur}
        list={listId}
      />
      <SaveWatcher />
    </form>
  );
}
