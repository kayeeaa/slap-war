/* ======================================================================
   delete-child-account — dataLayer.deleteChildAccount(childId)
   Deletes the child's account and everything in it. Can't be undone.
   Only the child's ONLY grown-up can do this: if another grown-up is linked, this one should unlink instead.
   Body: { childId }. Returns { ok: true }.
   Errors: not-your-child, not-only-grown-up, not-a-parent.
   ====================================================================== */
import { adminClient, requireGrownUp, requireMyChild, serve, VoxieError } from "../_shared/voxie.ts";

serve(async (request, body) => {
  const admin = adminClient();
  const parentId = await requireGrownUp(admin, request);
  const childId = await requireMyChild(admin, parentId, body.childId);

  const { count, error: countError } = await admin.from("family_links")
    .select("parent_id", { count: "exact", head: true }).eq("child_id", childId);
  if (countError) throw new VoxieError("save-failed", 500);
  if ((count ?? 0) > 1) throw new VoxieError("not-only-grown-up", 403);

  // 1. Every row for the child (buddies, tasks, items, chance rolls, missions, friends, invite codes).
  //    The profile and family link stay until step 2, so a failure in step 2 can be retried.
  const { error: dataError } = await admin.rpc("delete_child_data", { p_child_id: childId });
  if (dataError) throw new VoxieError("save-failed", 500);

  // 2. The login. Deleting the auth user removes the profile and family link through the foreign keys.
  const { error: authError } = await admin.auth.admin.deleteUser(childId);
  if (authError) throw new VoxieError("save-failed", 500);
  return { ok: true };
});
