/* ======================================================================
   content/inventory.js  —  the sections and rarities items use. The items themselves are in content/items/ below.
   category: which Inventory sub-tab it lives in.  rarity: common | rare | ultra | insane.
   slot: only one item per slot is used at once (so one hat, one thing held).
         Decorations each have their own slot, so they can all be out together.
   category "house" items show in the House tab (grouped by houseType) and appear in the room at Home.
   structural house items (window, floor, wallpaper…) change the room itself; the house starts as bare brick and concrete.
   Never rename an id once released: it's stored against the child.
   ====================================================================== */
/* Every item has a rarity. Inventory can be sorted by type (the categories below) or by rarity. */
const RARITIES = [
  { id: "common", label: "Common",        shortLabel: "Common", colour: "#8C97A3" },
  { id: "rare",   label: "Rare",          shortLabel: "Rare",   colour: "#3E8EDB" },
  { id: "ultra",  label: "Ultra rare",    shortLabel: "Ultra",  colour: "#9B59D0" },
  { id: "insane", label: "Insanely rare", shortLabel: "Insane", colour: "#E8A317" }
];
/* Items gain XP the child chooses to spend on them (XP only comes from missions). Enough XP moves an item up
   an ability level, and each level can switch on one of the item's POWERS. Deliberately hard: Advanced is about
   10 days of all your XP, Master about a month, and the same XP also pays for the Shop and Mystery boxes. */
const ABILITY_LEVELS = [
  { id: "basic",    label: "Basic",    xpNeeded: 0 },
  { id: "advanced", label: "Advanced", xpNeeded: 60 },
  { id: "master",   label: "Master",   xpNeeded: 200 }
];
/* ---------- Changing an item's colour ----------
   Unlocks once you've had the item for a while: RECOLOUR_BASE_LEVELS levels after you got it, plus more for rarer
   items, plus 1 more for every 10 levels you were when you got it. e.g. a Common at level 3 → level 13;
   a Rare at level 4 → level 19; an Insanely rare at level 30 → level 63. Until then the Colour box shows a padlock. */
const RECOLOUR_BASE_LEVELS = 10;
const RECOLOUR_EXTRA_LEVELS_BY_RARITY = { common: 0, rare: 5, ultra: 10, insane: 20 };
function recolourUnlockLevel(item, gotAtLevel) {
  return gotAtLevel + RECOLOUR_BASE_LEVELS + (RECOLOUR_EXTRA_LEVELS_BY_RARITY[item.rarity] || 0) + Math.floor(gotAtLevel / 10);
}
/* The colours an item can be changed to. Every colour the item is drawn in is shifted to this hue,
   keeping its light and dark parts, so details still show. */
const ITEM_COLOUR_OPTIONS = [
  { id: "original", label: "Original" },
  { id: "red",    label: "Red",    hue: 2 },   { id: "orange", label: "Orange", hue: 26 },
  { id: "yellow", label: "Yellow", hue: 48 },  { id: "green",  label: "Green",  hue: 122 },
  { id: "teal",   label: "Teal",   hue: 176 }, { id: "blue",   label: "Blue",   hue: 214 },
  { id: "purple", label: "Purple", hue: 268 }, { id: "pink",   label: "Pink",   hue: 325 }
];
const recolourCache = {};
function recolourHex(hex, colourId) {
  const option = ITEM_COLOUR_OPTIONS.find(candidate => candidate.id === colourId);
  if (!option || option.hue === undefined || typeof hex !== "string" || !/^#[0-9a-f]{6}$/i.test(hex)) return hex;
  const key = hex + colourId;
  if (recolourCache[key]) return recolourCache[key];
  const [red, green, blue] = [1, 3, 5].map(start => parseInt(hex.slice(start, start + 2), 16) / 255);
  const max = Math.max(red, green, blue), min = Math.min(red, green, blue), lightness = (max + min) / 2;
  const saturation = max === min ? 0 : (max - min) / (1 - Math.abs(2 * lightness - 1));
  // Near-black and near-white bits (eyes, shine) stay as they are.
  const result = lightness < 0.12 || lightness > 0.95 ? hex : hsl(option.hue, Math.round(Math.max(saturation, 0.5) * 100), Math.round(lightness * 100));
  return (recolourCache[key] = result);
}

/* ---------- Chance: Mystery box (Shop) and "Take a chance" (on a level unlock) ----------
   The odds are always shown to the child. Randomness happens on the server (data layer), never in the app.
   Chance only ever picks items the child doesn't own and that aren't sold in the Shop.
   Inside a rarity, each item's chanceWithinRarity (default 1) sets how likely it is against the others. */
const MYSTERY_BOX_PRICE = 20;
const MYSTERY_BOXES_PER_DAY = 3;
const MYSTERY_BOX_RARITY_ODDS = { common: 0.60, rare: 0.30, ultra: 0.09, insane: 0.01 };
/* The Lucky power moves some of Common's chance to the rarer ones. */
function mysteryBoxRarityOdds(luck = 0) {
  return { common: MYSTERY_BOX_RARITY_ODDS.common - luck, rare: MYSTERY_BOX_RARITY_ODDS.rare + luck * 0.7,
    ultra: MYSTERY_BOX_RARITY_ODDS.ultra + luck * 0.25, insane: MYSTERY_BOX_RARITY_ODDS.insane + luck * 0.05 };
}
/* The Daring power raises the chance of winning; Keep and Common share what's left. */
function takeAChanceOutcomes(daring = 0) {
  const win = daring || 1 / 3, rest = (1 - win) / 2;
  return [{ id: "rarer", chance: win }, { id: "keep", chance: rest }, { id: "common", chance: rest }];
}
/* Take a chance: only on an item you've JUST unlocked (its unlock level is your newest level), decided in the
   "New item!" pop-up. Keep it, close the pop-up, or level up again, and the chance is gone. Three equal outcomes. */
const TAKE_A_CHANCE_OUTCOMES = takeAChanceOutcomes(0); // rarer (win a rarer item) / keep / common (swap for a Common; the lost one goes into the Mystery box)
const canBeWonByChance = item => item.xpPrice === undefined;
/* [{ item, chance }] for a set of items: rarities weighted by rarityOdds (only rarities that have items count,
   so the odds always add up to 100%), then items weighted by chanceWithinRarity inside their rarity. */
function chancesFor(items, rarityOdds) {
  const rarities = RARITIES.map(rarity => rarity.id).filter(rarityId => items.some(item => item.rarity === rarityId));
  const rarityTotal = rarities.reduce((total, rarityId) => total + (rarityOdds ? rarityOdds[rarityId] || 0 : 1), 0);
  return rarities.flatMap(rarityId => {
    const inRarity = items.filter(item => item.rarity === rarityId);
    const weightTotal = inRarity.reduce((total, item) => total + (item.chanceWithinRarity ?? 1), 0);
    const rarityChance = (rarityOdds ? rarityOdds[rarityId] || 0 : 1) / rarityTotal;
    return inRarity.map(item => ({ item, chance: rarityChance * (item.chanceWithinRarity ?? 1) / weightTotal }));
  });
}
/* Mystery box: every rarity can come up every time, at the same odds. Inside a rarity it picks something you don't
   have yet if it can. If you already have everything in that rarity you get a duplicate, which turns into XP back. */
const DUPLICATE_XP_BACK = { common: 5, rare: 10, ultra: 20, insane: 40 };
function mysteryBoxChances(isOwned, luck = 0) {
  const odds = mysteryBoxRarityOdds(luck);
  const rarities = RARITIES.filter(rarity => INVENTORY_ITEMS.some(item => canBeWonByChance(item) && item.rarity === rarity.id));
  const oddsTotal = rarities.reduce((total, rarity) => total + odds[rarity.id], 0);
  return rarities.flatMap(rarity => {
    const inRarity = INVENTORY_ITEMS.filter(item => canBeWonByChance(item) && item.rarity === rarity.id);
    const notOwned = inRarity.filter(item => !isOwned(item.id)), pool = notOwned.length ? notOwned : inRarity;
    const weightTotal = pool.reduce((total, item) => total + (item.chanceWithinRarity ?? 1), 0);
    return pool.map(item => ({ item, duplicate: !notOwned.length, chance: (odds[rarity.id] / oddsTotal) * (item.chanceWithinRarity ?? 1) / weightTotal }));
  });
}
/* Shop price after the Bargain power (never below 1). */
function shopPrice(item, bargain = 0) { return Math.max(1, Math.round(item.xpPrice * (1 - bargain))); }
/* For a "Take a chance" win: unowned items of the next rarity up (or higher, if that rarity is all collected). */
function rarerPrizesFor(item, isOwned) {
  const rarityIds = RARITIES.map(rarity => rarity.id);
  for (const rarityId of rarityIds.slice(rarityIds.indexOf(item.rarity) + 1)) {
    const prizes = INVENTORY_ITEMS.filter(candidate => candidate.rarity === rarityId && canBeWonByChance(candidate) && !isOwned(candidate.id));
    if (prizes.length) return prizes;
  }
  return [];
}
function commonSwapsFor(item, isOwned) {
  return INVENTORY_ITEMS.filter(candidate => candidate.rarity === "common" && candidate.id !== item.id && canBeWonByChance(candidate) && !isOwned(candidate.id));
}
function pickByChance(chanceList, randomNumber) {
  let running = 0;
  for (const entry of chanceList) { running += entry.chance; if (randomNumber < running) return entry; }
  return chanceList[chanceList.length - 1];
}
/* "1 in 340" style text. Kids love seeing how rare something is. */
function chanceText(chance) {
  if (!(chance > 0)) return "";
  if (chance >= 0.01) return `${Math.round(chance * 100)}%`;
  return `1 in ${Math.round(1 / chance).toLocaleString("en-GB")}`;
}
/* An item's chance from a brand-new Mystery box (nothing owned): a fixed "how rare is this" number. */
function boxChanceFromFullBox(itemId) {
  const entry = mysteryBoxChances(() => false).find(candidate => candidate.item.id === itemId);
  return entry ? entry.chance : 0;
}
const getRarity = rarityId => RARITIES.find(rarity => rarity.id === rarityId) || RARITIES[0];
function rarityBadgeHtml(rarityId) {
  const rarity = getRarity(rarityId);
  return `<span class="rarity rarity-${rarity.id}"><span class="gem" style="background:${rarity.colour}"></span>${rarity.label}</span>`;
}
const INVENTORY_CATEGORIES = [
  { id: "clothes",     label: "Clothes",     hint: "Hats and clothes. One hat, one thing round the neck and one thing on the back at a time." },
  { id: "weapons",     label: "Weapons",     hint: "{pet} holds one thing at a time, so picking a weapon puts away anything else it's holding." },
  { id: "tools",       label: "Tools",       hint: "Tools to hold. Holding one puts any weapon away." },
  { id: "pets",        label: "Pets",        hint: "Little pals that hang out with {pet}, wherever it goes. One at a time." },
  { id: "extras",      label: "Extras",      hint: "Badges, bags, balloons and gadgets. Mix them with your Clothes." }
];
/* Sections in the House tab (sort by type). Each house item has a houseType. */
const HOUSE_TYPES = [
  { id: "wallpaper", label: "Walls",     hint: "Cover up the bricks. One at a time." },
  { id: "floor",     label: "Floors",    hint: "Floors and rugs for the room." },
  { id: "furniture", label: "Furniture", hint: "Things to fill the room." },
  { id: "windows",   label: "Windows",   hint: "Windows and doors." },
  { id: "extras",    label: "Extras",    hint: "Plants, toys and bits for the room. Put out as many as you like." }
];
