"use client";

import { useState } from "react";

// A public, keyless logo CDN (Clearbit) can 404 for a wrong or unlisted
// domain - this hides itself on error instead of showing a broken-image
// icon, same spirit as Avatar's initial-letter fallback.
export default function CompanyLogo({ src, name, size = 20 }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return null;
  return (
    <img
      src={src}
      alt=""
      width={size}
      height={size}
      style={{ borderRadius: 4, objectFit: "contain", background: "#fff", border: "1px solid var(--line)", flex: `0 0 ${size}px` }}
      onError={() => setFailed(true)}
    />
  );
}
