/* ---------- content/powers.js ----------
   What an item's Advanced and Master abilities do. An item lists them as  abilities: { advanced: "hint", master: "brain-boost" }.
   A power only works while its item is IN USE (worn, held, or a pet that's out). Two of the same power don't add up:
   the strongest one counts. values: the number the power uses at each tier. Powers never touch level points
   (tasks are ticked on trust), only missions, XP and luck. */
const POWERS = [
  { id: "bonus-mission",   label: "Bonus mission",   values: { advanced: 1, master: 1 },       describe: value => "An extra mission every day" },
  { id: "think-again",     label: "Think again",     values: { advanced: 1, master: 2 },       describe: value => `${timesADay(value)}, have another go at a wrong answer` },
  { id: "hint",            label: "Hint",            values: { advanced: 1, master: 2 },       describe: value => `${timesADay(value)}, cross out a wrong answer` },
  { id: "brain-boost",     label: "Brain boost",     values: { advanced: 1, master: 2 },       describe: value => `+${value} XP for every right answer` },
  { id: "extra-time",      label: "Extra time",      values: { advanced: 5, master: 10 },      describe: value => `+${value} seconds on timed missions` },
  { id: "lucky",           label: "Lucky",           values: { advanced: 0.05, master: 0.10 }, describe: value => `Better Mystery box odds (Common ${Math.round(value * 100)}% less likely)` },
  { id: "bargain",         label: "Bargain",         values: { advanced: 0.20, master: 0.30 }, describe: value => `Shop prices ${Math.round(value * 100)}% off` },
  { id: "daring",          label: "Daring",          values: { advanced: 0.50, master: 0.60 }, describe: value => `${Math.round(value * 100)}% chance to win when you take a chance` },
  { id: "treasure-finder", label: "Treasure finder", values: { advanced: 1, master: 1 },       describe: value => "A free surprise item every week" },
  { id: "streak-shield",   label: "Streak shield",   values: { advanced: 1, master: 1 },       describe: value => "Missing one day a week won't break your streak" }
];
function timesADay(count) { return count === 1 ? "Once a day" : count === 2 ? "Twice a day" : `${count} times a day`; }
function getPower(powerId) { return POWERS.find(power => power.id === powerId); }
const POWER_TIERS = ["advanced", "master"];
/* [{ tier, tierLabel, xpNeeded, power, value }] for an item's abilities. */
function itemPowers(item) {
  return POWER_TIERS.filter(tier => item.abilities && item.abilities[tier]).map(tier => {
    const power = getPower(item.abilities[tier]), abilityLevel = ABILITY_LEVELS.find(level => level.id === tier);
    return { tier, tierLabel: abilityLevel.label, xpNeeded: abilityLevel.xpNeeded, power, value: power.values[tier] };
  });
}
/* { powerId: value } switched on by the items in use. House items can't hold XP, so they never give powers. */
function activePowersFor(equippedItemIds, itemXpById) {
  const active = {};
  equippedItemIds.map(getInventoryItem).filter(item => item && item.category !== "house").forEach(item => {
    itemPowers(item).filter(entry => (itemXpById[item.id] || 0) >= entry.xpNeeded)
      .forEach(entry => { active[entry.power.id] = Math.max(active[entry.power.id] || 0, entry.value); });
  });
  return active;
}
/* The XP worth putting into an item: up to its highest power (no point going further). */
function usefulXpFor(item) {
  const tiers = itemPowers(item);
  return tiers.length ? Math.max(...tiers.map(entry => entry.xpNeeded)) : 0;
}
function abilityLevelFor(itemXp) { return [...ABILITY_LEVELS].reverse().find(abilityLevel => itemXp >= abilityLevel.xpNeeded); }
