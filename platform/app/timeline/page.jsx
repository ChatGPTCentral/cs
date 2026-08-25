import { redirect } from "next/navigation";

// Timeline merged into /genesis - momenti and fili now render inline with
// the dated facts they share a month with, instead of living on a second
// page. Kept as a redirect so old links and bookmarks still land somewhere.
export default function TimelineRedirect() {
  redirect("/genesis");
}
