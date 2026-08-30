// Role-based ICP scoring, sourced from the alex-writing-style skill's
// documented ideal customer profile (Good/Medium/Bad fit tables). Only the
// role criteria are checked here - pricing tier and free-tier availability
// aren't knowable from a LinkedIn export, so this scores title fit only,
// not full ICP fit. Never invent a company's pricing or funding to fill
// that gap - leave it unscored.
const GOOD_ROLES = [
  "founder",
  "co-founder",
  "chief executive",
  "\\bceo\\b",
  "chief marketing",
  "\\bcmo\\b",
  "vp marketing",
  "vice president.*marketing",
  "head of growth",
  "growth lead",
  "partnership manager",
  "head of partnerships",
];

const MEDIUM_ROLES = [
  "affiliate marketing",
  "digital marketing",
  "head of demand gen",
  "demand generation",
];

function testAny(text, patterns) {
  return patterns.some((p) => new RegExp(p, "i").test(text));
}

// Returns "good", "medium", or null - never a guess beyond the role text.
export function icpRoleFit(position) {
  const text = (position || "").toLowerCase();
  if (!text) return null;
  if (testAny(text, GOOD_ROLES)) return "good";
  if (testAny(text, MEDIUM_ROLES)) return "medium";
  return null;
}
