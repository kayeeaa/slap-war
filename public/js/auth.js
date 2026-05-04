// Shared auth helpers for the planner — loaded by every planner page.

async function hashPin(pin) {
  const enc = new TextEncoder();
  const buf = await crypto.subtle.digest('SHA-256', enc.encode(pin));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function setSession(profile) {
  sessionStorage.setItem('hok_session', JSON.stringify({
    id:        profile.id,
    name:      profile.name,
    color:     profile.color,
    colorName: profile.color_name
  }));
}

function getSession() {
  try {
    return JSON.parse(sessionStorage.getItem('hok_session'));
  } catch {
    return null;
  }
}

function requireSession() {
  const s = getSession();
  if (!s) { window.location.replace('/planner/'); return null; }
  return s;
}

function clearSession() {
  sessionStorage.removeItem('hok_session');
}
