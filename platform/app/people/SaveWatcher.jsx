"use client";

import { useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";

// Drop this inside any <form action={serverAction}> to fire a "saved"
// event the moment that form's submission finishes - no redirect, no URL
// change, so the page never re-navigates and scroll position is left
// alone. SavedToast listens for the event and shows the confirmation.
export default function SaveWatcher() {
  const { pending } = useFormStatus();
  const wasPending = useRef(false);

  useEffect(() => {
    if (wasPending.current && !pending) {
      window.dispatchEvent(new CustomEvent("crm:saved"));
    }
    wasPending.current = pending;
  }, [pending]);

  return null;
}
