/* ======================================================================
   content/customise.js  —  how a child can change their pet.
   Each option has an unlockLevel; level 1 options are available from the start.
   Never rename an id once released: it's stored against the child.
   ====================================================================== */
const BODY_COLOURS = [
  { id: "original", label: "Original", unlockLevel: 1 },
  { id: "mint",     label: "Mint",     unlockLevel: 1,  palette: { B:"#A6E3C4", D:"#4E9E7B", L:"#E1F6EB", S:"#7CC4A1" } },
  { id: "lilac",    label: "Lilac",    unlockLevel: 5,  palette: { B:"#C9B6F2", D:"#7E62C4", L:"#EEE7FC", S:"#A48CE0" } },
  { id: "golden",   label: "Golden",   unlockLevel: 8,  palette: { B:"#F2C95C", D:"#B88A1E", L:"#FBEBB8", S:"#D9A93A" } },
  { id: "midnight", label: "Midnight", unlockLevel: 11, palette: { B:"#56648F", D:"#2E3858", L:"#9AA6CC", S:"#414E78" } },
  { id: "snow",     label: "Snow",     unlockLevel: 14, palette: { B:"#EEF1F5", D:"#A9B2BF", L:"#FFFFFF", S:"#CDD3DC" } }
];
const FACES = [
  { id: "happy",      label: "Happy",      unlockLevel: 1 },
  { id: "grin",       label: "Big grin",   unlockLevel: 1 },
  { id: "surprised",  label: "Surprised",  unlockLevel: 4 },
  { id: "sleepy",     label: "Sleepy",     unlockLevel: 6 },
  { id: "cheeky",     label: "Cheeky",     unlockLevel: 9 },
  { id: "determined", label: "Determined", unlockLevel: 12 }
];
const ARM_POSES = [
  { id: "down",  label: "Down",  unlockLevel: 1 },
  { id: "wave",  label: "Wave",  unlockLevel: 1 },
  { id: "cheer", label: "Cheer", unlockLevel: 5 },
  { id: "wide",  label: "Wide",  unlockLevel: 10 }
];
const BODY_WIDTHS = [
  { id: "normal",       label: "Normal",       factor: 1,    unlockLevel: 1 },
  { id: "chunky",       label: "Chunky",       factor: 1.2,  unlockLevel: 2 },
  { id: "slim",         label: "Slim",         factor: 0.85, unlockLevel: 7 },
  { id: "extra-chunky", label: "Extra chunky", factor: 1.35, unlockLevel: 13 }
];
const BODY_HEIGHTS = [
  { id: "normal",     label: "Normal",     factor: 1,    unlockLevel: 1 },
  { id: "tall",       label: "Tall",       factor: 1.15, unlockLevel: 3 },
  { id: "short",      label: "Short",      factor: 0.85, unlockLevel: 10 },
  { id: "extra-tall", label: "Extra tall", factor: 1.3,  unlockLevel: 14 }
];
/* Buddies and rebirth. Each buddy has its own level (tasks level up the buddy that's playing).
   Every 100 levels a buddy reaches earns one rebirth: pick a pet type you haven't collected yet and
   start it at level 1. Retired buddies float on screen with angel wings and a halo, and you can switch
   back to any of them and carry on where you left off. The aim: collect every pet and level them all.
   Unlocks (items, places, looks) use the HIGHEST level any of your buddies has reached, so a rebirth
   never takes anything away. */
const REBIRTH_EVERY_LEVELS = 100;
function rebirthsEarned(buddyLevels) { return buddyLevels.reduce((total, level) => total + Math.floor(level / REBIRTH_EVERY_LEVELS), 0); }
/* You start with one buddy, so each extra buddy used up one rebirth. */
function rebirthsAvailable(buddyLevels) { return Math.max(0, rebirthsEarned(buddyLevels) - (buddyLevels.length - 1)); }
const DEFAULT_PET_LOOK = { bodyColour: "original", face: "happy", arms: "down", width: "normal", height: "normal" };
const findOption = (options, optionId) => options.find(option => option.id === optionId) || options[0];
