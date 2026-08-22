// Plain <img>, not next/image - this app has stayed away from anything
// needing config/build-step wiring (see platform/lib/supabase.js's "no
// SDK" note), and a remote-pattern allowlist for LinkedIn's CDN is the
// same kind of extra moving part. Falls back to an initial-letter circle
// when there's no photo yet - most people won't have one.
export default function Avatar({ name, photoUrl, size = 28 }) {
  const initial = (name || "?").trim().charAt(0).toUpperCase();
  const style = {
    width: size,
    height: size,
    borderRadius: "50%",
    flex: `0 0 ${size}px`,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: size * 0.42,
    fontWeight: 600,
    background: "var(--surface-2)",
    color: "var(--ink-faint)",
    overflow: "hidden",
  };

  if (photoUrl) {
    return (
      <img
        src={photoUrl}
        alt=""
        width={size}
        height={size}
        style={{ ...style, objectFit: "cover" }}
      />
    );
  }

  return <span style={style}>{initial}</span>;
}
