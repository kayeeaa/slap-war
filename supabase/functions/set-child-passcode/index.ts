/* ======================================================================
   set-child-passcode — dataLayer.setChildPasscode(childId, passcode)
   Children have no email, so their grown-up sets a new passcode for them.
   Body: { childId, passcode }. Returns { ok: true }.
   Errors: not-your-child, too-short, too-long, not-a-parent.
   ====================================================================== */
import { adminClient, checkPasscode, passwordErrorCode, requireGrownUp, requireMyChild, serve, VoxieError } from "../_shared/voxie.ts";

serve(async (request, body) => {
  const admin = adminClient();
  const parentId = await requireGrownUp(admin, request);
  const childId = await requireMyChild(admin, parentId, body.childId);
  const passcode = checkPasscode(body.passcode);

  const { error } = await admin.auth.admin.updateUserById(childId, { password: passcode });
  if (error) throw new VoxieError(passwordErrorCode(error.message), error.status === 422 ? 400 : 500);
  return { ok: true };
});
