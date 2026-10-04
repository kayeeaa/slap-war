/* The "New password" page a grown-up reaches from the reset email (dataLayer.requestPasscodeReset).
   supabase-js reads the recovery link from the address bar and signs them in for this one job. */
const MIN_PASSCODE_LENGTH = 6;   // same as engine/progression.js and Supabase's minimum password length
const element = id => document.getElementById(id);
const supabaseClient = supabase.createClient(VOXIE_SUPABASE_URL, VOXIE_SUPABASE_ANON_KEY);

function showMessage(text, showHomeLink) {
  element("newPasscodeMessageText").textContent = text;
  element("newPasscodeHome").hidden = !showHomeLink;
  element("newPasscodeMessage").hidden = false;
}
function showForm() {
  element("newPasscodeRule").textContent = `At least ${MIN_PASSCODE_LENGTH} characters.`;
  element("newPasscodeMessage").hidden = true;
  element("newPasscodeForm").hidden = false;
  element("newPasscode").focus();
}

let formShown = false;
supabaseClient.auth.onAuthStateChange(event => {
  if (event === "PASSWORD_RECOVERY" && !formShown) { formShown = true; showForm(); }
});
// If the link was already used or has run out, there's no recovery sign-in to wait for.
setTimeout(async () => {
  if (formShown) return;
  const { data } = await supabaseClient.auth.getSession();
  if (data.session) { formShown = true; showForm(); }
  else showMessage("This link has run out or has already been used. Go to Voxie, tap Log in, then \"Forgotten your passcode?\" to get a new one.", true);
}, 1500);

element("newPasscodeForm").onsubmit = async event => {
  event.preventDefault();
  const password = element("newPasscode").value, again = element("newPasscodeAgain").value;
  const say = message => { element("newPasscodeError").textContent = message; };
  if (password.length < MIN_PASSCODE_LENGTH) return say(`Make it at least ${MIN_PASSCODE_LENGTH} characters.`);
  if (password !== again) return say("Those two passwords don't match.");
  element("newPasscodeButton").disabled = true; say("");
  const { error } = await supabaseClient.auth.updateUser({ password });
  element("newPasscodeButton").disabled = false;
  if (error) return say(/different/i.test(error.message) ? "That's your old password. Pick a new one." : "Couldn't save it. Check your internet and try again.");
  element("newPasscodeForm").hidden = true;
  showMessage("Done! Your new password is saved and you're logged in.", true);
};
