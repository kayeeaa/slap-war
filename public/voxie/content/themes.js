/* ======================================================================
   content/themes.js  —  colours a child can pick, and backgrounds.
   ====================================================================== */
const THEME_COLOURS = [
  { id: "green",  label: "Green",  hue: 122, saturation: 39 },
  { id: "teal",   label: "Teal",   hue: 176, saturation: 45 },
  { id: "blue",   label: "Blue",   hue: 212, saturation: 55 },
  { id: "purple", label: "Purple", hue: 262, saturation: 45 },
  { id: "pink",   label: "Pink",   hue: 330, saturation: 50 },
  { id: "orange", label: "Orange", hue: 24,  saturation: 70 },
  { id: "yellow", label: "Yellow", hue: 46,  saturation: 92, accentLightness: 50, accentLightnessDark: 55, darkTextOnAccent: true, darkTextOnAccentDark: true },
  { id: "black",  label: "Black",  hue: 220, saturation: 6,  tint: 3, accentLightness: 16, accentLightnessDark: 72, darkTextOnAccentDark: true },
  { id: "white",  label: "White",  hue: 220, saturation: 6,  tint: 3, accentLightness: 88, accentLightnessDark: 94, accentDarkLightness: 42, darkTextOnAccent: true, darkTextOnAccentDark: true, swatchLightness: 98 }
];
function getThemeColour(colourId) { return THEME_COLOURS.find(colour => colour.id === colourId) || THEME_COLOURS[0]; }
function applyThemeColour(colourId) {
  const colour = getThemeColour(colourId);
  document.documentElement.style.setProperty("--hue", colour.hue);
  document.documentElement.style.setProperty("--sat", colour.saturation + "%");
  document.documentElement.style.setProperty("--accent-l", (colour.accentLightness || 39) + "%");
  document.documentElement.style.setProperty("--accent-l-dark", (colour.accentLightnessDark || 52) + "%");
  document.documentElement.style.setProperty("--tint", (colour.tint ?? 24) + "%");
  // White is too pale for text and outlines, so it gets its own darker shade for those.
  if (colour.accentDarkLightness) document.documentElement.style.setProperty("--accent-dk-l", colour.accentDarkLightness + "%");
  else document.documentElement.style.removeProperty("--accent-dk-l");
  document.documentElement.style.setProperty("--on-accent-light", colour.darkTextOnAccent ? "#1E1E22" : "#FFFFFF");
  document.documentElement.style.setProperty("--on-accent-dark", colour.darkTextOnAccentDark ? "#1E1E22" : "#FFFFFF");
}
const hsl = (hue, saturation, lightness) => `hsl(${hue} ${saturation}% ${lightness}%)`;
