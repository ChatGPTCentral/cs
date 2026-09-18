// The five columns the /deals board reads and writes. Order here is the
// display order on the page - keep the two in sync. Plain module (not
// "use server") because a server-action file may only export async
// functions - constants live here instead.
export const DEAL_STAGES = ["waiting", "decision", "blocked", "dormant", "affiliate"];
