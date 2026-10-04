/* ======================================================================
   supabase/functions/_shared/voxie.ts — shared bits for the three service-role Edge Functions.
   Errors go back as { error: "<code>" } using the same codes dataLayer.js throws, e.g.
     const { data, error } = await supabase.functions.invoke("add-child", { body });
     if (error) throw new Error((await error.context.json()).error ?? "save-failed");
   ====================================================================== */
import { createClient, type SupabaseClient } from "jsr:@supabase/supabase-js@2";

// Same numbers as engine/progression.js and dataLayer.js.
export const MIN_PASSCODE_LENGTH = 6;
export const MAX_PASSCODE_LENGTH = 72;   // Supabase Auth's limit
export const MIN_CHILD_AGE = 4;
export const MAX_CHILD_AGE = 16;
export const MAX_CHILDREN_PER_GROWN_UP = 8;
export const HIDDEN_EMAIL_DOMAIN = "kids.voxie.invalid";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

/** An error whose message is a dataLayer error code. */
export class VoxieError extends Error {
  constructor(public code: string, public status = 400) { super(code); }
}

export function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
}

/** Service-role client: bypasses RLS. Only ever used inside these functions. */
export function adminClient(): SupabaseClient {
  return createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

/** The caller must be signed in as a grown-up. Returns their user id. */
export async function requireGrownUp(admin: SupabaseClient, request: Request): Promise<string> {
  const token = (request.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "");
  if (!token) throw new VoxieError("not-signed-in", 401);
  const { data, error } = await admin.auth.getUser(token);
  if (error || !data.user) throw new VoxieError("not-signed-in", 401);
  const { data: profile, error: profileError } = await admin.from("profiles").select("role").eq("id", data.user.id).maybeSingle();
  if (profileError) throw new VoxieError("save-failed", 500);
  if (profile?.role !== "parent") throw new VoxieError("not-a-parent", 403);
  return data.user.id;
}

/** The grown-up must be linked to this child in family_links. */
export async function requireMyChild(admin: SupabaseClient, parentId: string, childId: unknown): Promise<string> {
  if (typeof childId !== "string" || !isUuid(childId)) throw new VoxieError("not-your-child", 403);
  const { data, error } = await admin.from("family_links").select("child_id")
    .eq("parent_id", parentId).eq("child_id", childId).maybeSingle();
  if (error) throw new VoxieError("save-failed", 500);
  if (!data) throw new VoxieError("not-your-child", 403);
  return childId;
}

export function checkPasscode(passcode: unknown): string {
  if (typeof passcode !== "string" || passcode.length < MIN_PASSCODE_LENGTH) throw new VoxieError("too-short");
  if (passcode.length > MAX_PASSCODE_LENGTH) throw new VoxieError("too-long");
  return passcode;
}

export function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

/** getTodayInUk() */
export function todayInUk(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/London" }).format(new Date());
}

/** ageFromBirthMonth(): in their birth month they count as having had their birthday. */
export function ageFromBirthMonth(birthMonth: number, birthYear: number, isoDate = todayInUk()): number {
  const [year, month] = isoDate.split("-").map(Number);
  return year - birthYear - (month < birthMonth ? 1 : 0);
}

/** checkBirthMonth(): the child must be MIN_CHILD_AGE to MAX_CHILD_AGE now. Throws "bad-birth-month". */
export function checkBirthMonth(birthMonth: unknown, birthYear: unknown): number {
  if (!Number.isInteger(birthMonth) || !Number.isInteger(birthYear)) throw new VoxieError("bad-birth-month");
  const month = birthMonth as number, year = birthYear as number;
  if (month < 1 || month > 12) throw new VoxieError("bad-birth-month");
  const age = ageFromBirthMonth(month, year);
  if (age < MIN_CHILD_AGE || age > MAX_CHILD_AGE) throw new VoxieError("bad-birth-month");
  return age;
}

/** Turns a Supabase Auth password error into a dataLayer code. */
export function passwordErrorCode(message: string): string {
  return /password/i.test(message) ? "too-short" : "save-failed";
}

/** Wraps a handler: CORS, POST only, JSON body, and VoxieError → { error: code }. */
export function serve(handler: (request: Request, body: Record<string, unknown>) => Promise<unknown>) {
  Deno.serve(async (request) => {
    if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
    if (request.method !== "POST") return json({ error: "not-found" }, 405);
    try {
      let body: unknown;
      try { body = await request.json(); } catch { throw new VoxieError("bad-request"); }
      if (!body || typeof body !== "object" || Array.isArray(body)) throw new VoxieError("bad-request");
      return json(await handler(request, body as Record<string, unknown>));
    } catch (error) {
      if (error instanceof VoxieError) return json({ error: error.code }, error.status);
      console.error(error);
      return json({ error: "save-failed" }, 500);
    }
  });
}
