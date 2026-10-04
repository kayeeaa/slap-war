/* ======================================================================
   content/registry.js  —  HOW CONTENT IS ADDED.
   Every item, house item, location and mission is its own small block below,
   marked  "---------- content/items/<id>.js ----------"  etc.
   In the real app each block is its own file that does
       export default { id: "...", ... }
   and one loader line per folder registers them all:
       Object.values(import.meta.glob("./items/*.js", { eager: true })).forEach(file => addItem(file.default));
   So adding something new = adding ONE file. No other code changes.
   Anything with a mistake is skipped with a clear message in the console, so one bad file can't break the game.
   Never rename an id once kids have used it: Supabase stores ids (equipped_items, item_xp, mission_completions).
   ====================================================================== */
const INVENTORY_ITEMS = [];
const LOCATIONS = [];
const MISSIONS = [];
const PET_TYPES = {};   // buddy types, by id
const PET_ORDER = [];   // buddy type ids in the order they were added
function reportContentProblem(kind, id, problems) {
  console.error(`Voxie: ${kind} "${id || "(no id)"}" was skipped: ${problems.join("; ")}`);
}
function addItem(item) {
  const problems = [];
  ["id", "label", "category", "slot", "rarity"].forEach(field => { if (item[field] === undefined || item[field] === "") problems.push(`needs ${field}`); });
  // Every item is got ONE way: unlockLevel (levelling up), xpPrice (Shop) or chanceOnly: true (Mystery box / Take a chance).
  const waysToGet = [item.unlockLevel !== undefined, item.xpPrice !== undefined, item.chanceOnly === true].filter(Boolean).length;
  if (waysToGet !== 1) problems.push("needs exactly ONE of: unlockLevel, xpPrice, chanceOnly: true");
  if (item.abilities) Object.entries(item.abilities).forEach(([tier, powerId]) => {
    if (!POWER_TIERS.includes(tier)) problems.push(`abilities can only be advanced or master, not "${tier}"`);
    else if (!getPower(powerId)) problems.push(`no power called "${powerId}" (see content/powers.js)`);
  });
  if (item.chanceWithinRarity !== undefined && !(item.chanceWithinRarity > 0)) problems.push("chanceWithinRarity must be above 0 (1 = normal, 0.001 = very hard to get)");
  if (item.xpPrice !== undefined && !(Number.isInteger(item.xpPrice) && item.xpPrice > 0)) problems.push("xpPrice must be a whole number above 0");
  if (INVENTORY_ITEMS.some(existing => existing.id === item.id)) problems.push(`the id "${item.id}" is already used by another item`);
  if (item.rarity && !RARITIES.some(rarity => rarity.id === item.rarity)) problems.push(`rarity must be one of ${RARITIES.map(rarity => rarity.id).join(", ")}`);
  if (item.category === "house") {
    if (!HOUSE_TYPES.some(type => type.id === item.houseType)) problems.push(`houseType must be one of ${HOUSE_TYPES.map(type => type.id).join(", ")}`);
    if (item.drawInRoom && !ROOM_LAYERS.includes(item.roomLayer)) problems.push(`roomLayer must be one of ${ROOM_LAYERS.join(", ")}`);
  } else if (item.category && !INVENTORY_CATEGORIES.some(category => category.id === item.category)) {
    problems.push(`category must be "house" or one of ${INVENTORY_CATEGORIES.map(category => category.id).join(", ")}`);
  }
  if (!item.sprite && !item.drawOnPet && !item.drawBehindPet && !item.drawInRoom && !item.drawOnFloor) problems.push("needs a sprite (pixel grid) or a draw function");
  if (problems.length) return reportContentProblem("item", item.id, problems);
  INVENTORY_ITEMS.push({ season: null, ...item, structural: Boolean(item.drawInRoom) });
}
function addLocation(location) {
  const problems = [];
  ["id", "label", "unlockLevel"].forEach(field => { if (location[field] === undefined || location[field] === "") problems.push(`needs ${field}`); });
  if (LOCATIONS.some(existing => existing.id === location.id)) problems.push(`the id "${location.id}" is already used by another location`);
  if (problems.length) return reportContentProblem("location", location.id, problems);
  LOCATIONS.push({ season: null, ...location });
}
/* Buddy types. Every pet is a 14 × 12 pixel map (see content/pets/ for the letters).
   face / arms / neckRow say where faces, arms and neck items go, so every item and face fits every pet. */
const PET_MAP_COLUMNS = 14, PET_MAP_ROWS = 12;
function addPetType(petType) {
  const problems = [];
  ["id", "label", "pixelMap", "palette", "face", "arms", "neckRow"].forEach(field => { if (petType[field] === undefined) problems.push(`needs ${field}`); });
  if (PET_TYPES[petType.id]) problems.push(`the id "${petType.id}" is already used by another pet`);
  if (petType.pixelMap && (petType.pixelMap.length !== PET_MAP_ROWS || petType.pixelMap.some(row => row.length !== PET_MAP_COLUMNS)))
    problems.push(`pixelMap must be ${PET_MAP_ROWS} rows of exactly ${PET_MAP_COLUMNS} characters`);
  if (petType.palette) ["B", "D", "L", "S", "E", "M", "N"].forEach(letter => { if (!petType.palette[letter]) problems.push(`palette needs a colour for ${letter}`); });
  if (petType.face && ["eyeRow", "leftEyeX", "rightEyeX", "mouthRow", "mouthX"].some(key => petType.face[key] === undefined)) problems.push("face needs eyeRow, leftEyeX, rightEyeX, mouthRow, mouthX");
  if (petType.arms && ["row", "leftX", "rightX"].some(key => petType.arms[key] === undefined)) problems.push("arms needs row, leftX, rightX");
  if (problems.length) return reportContentProblem("pet", petType.id, problems);
  PET_TYPES[petType.id] = petType;
  PET_ORDER.push(petType.id);
}
const MISSION_TYPES = ["trivia", "scenario", "puzzle"];
function addMission(mission) {
  const problems = [];
  ["id", "type", "difficulty", "question", "options"].forEach(field => { if (mission[field] === undefined || mission[field] === "") problems.push(`needs ${field}`); });
  if (MISSIONS.some(existing => existing.id === mission.id)) problems.push(`the id "${mission.id}" is already used by another mission`);
  if (mission.type && !MISSION_TYPES.includes(mission.type)) problems.push(`type must be one of ${MISSION_TYPES.join(", ")}`);
  if (mission.difficulty !== undefined && !(mission.difficulty >= 1 && mission.difficulty <= 5)) problems.push("difficulty must be 1 to 5 (it's the XP for getting it right)");
  if (mission.type === "scenario") {
    if (!mission.wordsToSay) problems.push("scenario missions need wordsToSay");
    if (mission.options && !mission.options.some(option => option.isGoodChoice)) problems.push("at least one option needs isGoodChoice: true");
  } else if (mission.type && (mission.correctIndex === undefined || !mission.options || !mission.options[mission.correctIndex])) {
    problems.push("needs a correctIndex that points at one of the options (0 = first)");
  }
  if (problems.length) return reportContentProblem("mission", mission.id, problems);
  MISSIONS.push(mission);
}
/* The order house items are painted in, back to front.
   "wall" replaces the bare brick, "floor" replaces the concrete. */
const ROOM_LAYERS = ["wall", "on-wall", "floor", "on-floor"];

/* ======================================================================
   TEMPLATE  —  copy this to add a new item. The easiest way to draw it is a pixel grid:
   each letter is one pixel, "." is see-through, and "colours" says what each letter is.

   ---------- content/items/dragon-helmet.js ----------
   addItem({
     id: "dragon-helmet",          // permanent, lowercase-with-dashes
     label: "Dragon helmet",
     category: "clothes",          // clothes | weapons | tools | pets | extras | house
     slot: "head",                 // only one item per slot at a time:
                                   //   head, neck, chest, back, hand, float, companion (pets),
                                   //   house items: give each its own slot, e.g. "house-lamp"
     unlockLevel: 20,              // unlocked by levelling up…
                                   // …OR instead: xpPrice: 40  → sold in the Shop for XP, no level needed
                                   // …OR instead: chanceOnly: true → only from a Mystery box or Take a chance
     abilities: { advanced: "hint", master: "brain-boost" },  // optional powers (see content/powers.js)
     chanceWithinRarity: 1,        // optional. How likely it is compared with other items of the same rarity
                                   //   when picked by chance. 1 = normal, 0.001 = a thousand times harder.
     rarity: "ultra",              // common | rare | ultra | insane
     colourName: "Green", colour: "#3E8E41",
     season: null,                 // later: a season pass id
     sprite: {
       pixels: [
         "..G..G..",
         ".GGGGGG.",
         "GGYGGYGG",
       ],
       colours: { G: "#3E8E41", Y: "#F2C95C" }
     }
   });

   Where a sprite goes is worked out from its slot (on the pet: head sits on top, hand is held
   on the right, and so on). On the pet, one sprite pixel is half a pet block, so grids can be detailed.
   Pets (category "pets") and house extras (category "house", no roomLayer) stand on the floor;
   for house extras add floorPosition: 0 (left) to 1 (right).
   For things a grid can't do (e.g. a cape that follows the body), use drawOnPet(pet) instead:
   see hero-cape below for the helpers it gets.
   ====================================================================== */
