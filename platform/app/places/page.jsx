import { redirect } from "next/navigation";

// Merged into /genesis, 2026-09-12, per Alex - geography is a dimension
// of the genesis, not a separate thing. Kept as a redirect so old links
// and bookmarks still land somewhere.
export default function PlacesRedirect() {
  redirect("/genesis");
}
