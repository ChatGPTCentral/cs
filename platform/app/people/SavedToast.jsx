"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

// Reads ?saved=1 off the URL (set by a server action's redirect after a
// write), shows a green confirmation, then strips the param so a refresh
// doesn't bring it back.
export default function SavedToast() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const saved = searchParams.get("saved");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!saved) return;
    setVisible(true);
    const hide = setTimeout(() => setVisible(false), 2200);
    const clean = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("saved");
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    }, 2500);
    return () => {
      clearTimeout(hide);
      clearTimeout(clean);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saved]);

  if (!saved) return null;

  return (
    <div className={`saved-toast${visible ? " saved-toast-visible" : ""}`} role="status">
      ✓ Saved
    </div>
  );
}
