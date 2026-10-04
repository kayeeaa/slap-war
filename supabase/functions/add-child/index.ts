/* ======================================================================
   add-child — dataLayer.addChild({ birthMonth, birthYear, username, passcode })
   A grown-up adds a child. Creates the child's auth user with a hidden email nobody can receive mail at
   ("<child uuid>@kids.voxie.invalid"), then the profile + family link (database function create_child_profile,
   which also sets timed_missions off under TIMED_MISSIONS_FROM_AGE and enforces the 8-children limit).
   Returns the child as in loadMyChildren: { id, displayName, setupComplete, level, petName, look }.
   Errors: bad-birth-month, bad-username, username-taken, too-short, too-long, limit, not-a-parent.
   ====================================================================== */
import {
  adminClient, checkBirthMonth, checkPasscode, HIDDEN_EMAIL_DOMAIN, MAX_CHILDREN_PER_GROWN_UP,
  passwordErrorCode, requireGrownUp, serve, VoxieError,
} from "../_shared/voxie.ts";

serve(async (request, body) => {
  const admin = adminClient();
  const parentId = await requireGrownUp(admin, request);

  // Same checks, same order, as the fake addChild.
  checkBirthMonth(body.birthMonth, body.birthYear);
  const username = typeof body.username === "string" ? body.username.trim().toLowerCase() : "";
  if (!/^[a-z0-9_-]{3,20}$/.test(username)) throw new VoxieError("bad-username");
  const { count: usernameCount, error: usernameError } = await admin.from("profiles")
    .select("id", { count: "exact", head: true }).eq("username", username);
  if (usernameError) throw new VoxieError("save-failed", 500);
  if (usernameCount) throw new VoxieError("username-taken");
  const passcode = checkPasscode(body.passcode);
  const { count: childCount, error: countError } = await admin.from("family_links")
    .select("child_id", { count: "exact", head: true }).eq("parent_id", parentId);
  if (countError) throw new VoxieError("save-failed", 500);
  if ((childCount ?? 0) >= MAX_CHILDREN_PER_GROWN_UP) throw new VoxieError("limit");

  // 1. The auth user. app_metadata can only be set by the service role, so a sign-up can never claim to be a child.
  const childId = crypto.randomUUID();
  const { error: createError } = await admin.auth.admin.createUser({
    id: childId,
    email: `${childId}@${HIDDEN_EMAIL_DOMAIN}`,
    password: passcode,
    email_confirm: true,
    app_metadata: { voxie_role: "child" },
  });
  if (createError) throw new VoxieError(passwordErrorCode(createError.message), createError.status === 422 ? 400 : 500);

  // 2. Profile + family link in one transaction. The database re-checks everything (username race, limit race).
  const { data: child, error: profileError } = await admin.rpc("create_child_profile", {
    p_parent_id: parentId,
    p_child_id: childId,
    p_username: username,
    p_birth_month: body.birthMonth,
    p_birth_year: body.birthYear,
  });
  if (profileError) {
    await admin.auth.admin.deleteUser(childId);   // undo step 1 so no half-made account is left behind
    const known = ["bad-birth-month", "bad-username", "username-taken", "limit", "not-a-parent"];
    throw new VoxieError(known.includes(profileError.message) ? profileError.message : "save-failed",
      known.includes(profileError.message) ? 400 : 500);
  }
  return child;
});
