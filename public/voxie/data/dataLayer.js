/* ======================================================================
   data/dataLayer.js  —  FAKE BACKEND FOR THE PROTOTYPE.
   Claude Code: replace ONLY this block with Supabase calls. Keep every
   function name, its arguments and the shape of what it returns.
   Scheduled task shape: { id, title, daysOfWeek:["mon",…], timesPerDay }
   Profile shape: { id, role, display_name, theme_colour, location, active_buddy_id,
                    equipped_items:[ids], timed_missions, reset_streak_on_miss, setup_complete,
                    pet_type, pet_name, pet_look:{ bodyColour, face, arms, width, height } }
     pet_type / pet_name / pet_look come from the ACTIVE buddy (buddies table), so the rest of the app
     only ever looks at the profile. In Supabase: a "my_profile" view joining profiles + buddies.
   Buddies: table buddies (id, child_id, pet_type, pet_name, pet_look, theme_colour, adopted_on). Each buddy has its own
     look and GAME COLOUR (the app switches colour when you switch buddy). Items, the house, location and XP belong
     to the child and are shared by all their buddies.
     LEVELS ARE PER BUDDY: every completion row (chore_completions, scheduled_task_completions, own_tasks
     when done) stores buddy_id = the buddy that was playing, set by the database, not the app.
   Friends: table friend_requests (id, from_child_id, to_child_id, status "pending"|"accepted"|"declined",
     sent_on). Accepting creates friendships (child_id, friend_id), one row each way. Kids search by name
     (this app is family-only). Search and friends' progress must come from database functions that return
     only the safe fields shown here (name, pet, level, streak), never raw tables.
   ACCOUNTS ARE GROWN-UP FIRST. Only a grown-up signs up (signUpParent: email + password). They add each child
     (addChild: username, passcode, birth month and year), so a grown-up has agreed to every child account, and children
     are linked to their grown-up from the start. A child's REAL NAME, EMAIL, FULL DATE OF BIRTH AND GENDER ARE NEVER
     COLLECTED (UK GDPR data minimisation, ICO Children's code): the only things held about a child are their username
     and birth month and year (plus the made-up game name they pick at setup, display_name, which is empty until then,
     so the username is shown instead). profiles.birth_month (1–12) and birth_year are given by the grown-up, who can
     change them on the child's tab (setChildBirthMonth); the child can't. They're used ONLY to work out the child's age
     each day and pick missions that suit it. Keep them out of anything friends or search can see.
     Child logins: Supabase auth needs an email, so addChild runs in a database/edge function with the service role:
     auth.admin.createUser({ email: "<child id>@kids.voxie.invalid", password, email_confirm: true }) — a hidden
     address nobody can receive mail at — and stores the username on the profile (usernames are unique, lowercase).
     signIn(name, passcode): if the name has an "@" it's a grown-up's email; otherwise look up the username (rpc
     "email_for_username", which returns the hidden address only) and sign in with that. Never show hidden emails.
   Passcodes: grown-ups use "Forgotten your password?" (requestPasscodeReset = auth.resetPasswordForEmail(email,
     { redirectTo: <app>/new-passcode }); the app needs a small "New password" page for that link). Children can't get
     emails, so their grown-up sets a new passcode for them (setChildPasscode → auth.admin.updateUserById in a function
     that first checks the family link).
   Payments (later): put the plan on the GROWN-UP (profiles.plan "free"|"paid"). A child gets paid features if any of
     their linked grown-ups is on a paid plan, so one payment covers the whole family.
   Chance: table chance_rolls (child_id, kind "box"|"gamble"|"treasure"|"milestone", milestone_buddy_id, milestone_level, risked_item_id, outcome, won_item_id, chance,
     xp_paid, rolled_on). Every roll is kept, so any "that's not fair!" can be checked. Rolls MUST happen in
     database functions (rpc "open_mystery_box", "take_a_chance"): if the app rolled the dice, it could be rigged.
     Mystery box rarity odds never change; an item you already own comes back as XP (xp_refunded).
     Items won are owned; an item swapped away by "common" is no longer owned (it can be won back from a box).
     profiles.chance_features (default true): the "Mystery boxes and Take a chance" switch in Settings.
   Item colours: table item_colours (child_id, item_id, colour_id). setItemColour checks on the server that the
     item is owned and its recolour level is reached. purchases.got_at_level and chance_rolls.won_at_level record the
     child's level when they got a Shop / chance item (level unlocks use the item's unlockLevel).
   Powers: worked out on the SERVER from the child's equipped_items + item_xp (activePowersFor), never sent by the
     app. They change mission XP and daily limits (saveMissionCompletion), Mystery box odds, Take a chance odds,
     Shop prices and the weekly free item (claimWeeklyTreasure). mission_completions also stores used_hint and
     used_think_again so the daily limits can be checked, and did_it (true) for a Feel good mission (choice_index null).
   Missions: today's picks come from the child's age and mission_completions history (engine/missions.js), so
     loadProgressSummary returns missionsLastDoneOn. saveMissionCompletion should check the mission suits the child's age.
   "look" objects passed in: { displayName, petType, petName, themeColour, location, petLook }
   ====================================================================== */
function getTodayInUk() { return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/London" }).format(new Date()); }
function shiftDate(isoDate, days) { const date = new Date(isoDate + "T12:00:00Z"); date.setUTCDate(date.getUTCDate() + days); return date.toISOString().slice(0, 10); }

const FAKE_STORAGE_KEY = "voxie-prototype-v29";
const prototypeSettings = { failSaves: false, hideChores: false,
  forcedRandom: null, forcedOutcomeRandom: null }; // tests only: fix the dice (0–1) instead of Math.random()

function buildFakeDatabase() {
  const today = getTodayInUk(), thisYear = Number(today.slice(0, 4));
  const database = {
    signedInUserId: null,
    prototypeBonusLevelPoints: { "buddy-robin-1": pointsNeededForLevel(100) + 20 }, // by buddy id; Robin's Nugget is level 101
    prototypeBonusXp: { "child-2": 520, "child-3": 760, "child-4": 23, "child-5": 9 }, // Sky and Robin: lots of XP (some already put into items for powers)
    users: [
      { id: "child-1", username: "newplayer", passcode: "blocks1" },
      { id: "child-2", username: "sky", passcode: "blocks2" },
      { id: "child-3", username: "robin", passcode: "blocks3" },
      { id: "child-4", username: "jamie", passcode: "blocks4" },
      { id: "child-5", username: "max", passcode: "blocks5" },
      { id: "parent-1", email: "grown.up@example.com", passcode: "parent1" },
      { id: "parent-2", email: "sam@example.com", passcode: "parent2" }
    ],
    /* Test ages: newplayer 9, Sky 10, Robin 12, Jamie 6 (Feel good-heavy 5–7 missions, no timer), Max not given (8–13 missions). */
    profiles: {
      "child-1": { id: "child-1", role: "child", chance_features: true, display_name: "", birth_month: 1, birth_year: thisYear - 9, theme_colour: "green", location: "home", active_buddy_id: null, equipped_items: [], timed_missions: true, reset_streak_on_miss: true, setup_complete: false },
      "child-2": { id: "child-2", role: "child", child_can_change_settings: false, chance_features: true, display_name: "Sky", birth_month: 1, birth_year: thisYear - 10, theme_colour: "blue", location: "home", active_buddy_id: "buddy-sky-1", timed_missions: true, reset_streak_on_miss: true, equipped_items: ["pixel-sword", "crown", "pet-chick", "potted-plant", "window", "rug"], setup_complete: true },
      "child-4": { id: "child-4", role: "child", chance_features: true, display_name: "Jamie", birth_month: 1, birth_year: thisYear - 6, theme_colour: "teal", location: "beach", active_buddy_id: "buddy-jamie-1", timed_missions: false, reset_streak_on_miss: true, equipped_items: ["party-hat"], setup_complete: true },
      "child-5": { id: "child-5", role: "child", chance_features: true, display_name: "Max", theme_colour: "purple", location: "home", active_buddy_id: "buddy-max-1", timed_missions: true, reset_streak_on_miss: true, equipped_items: [], setup_complete: true },
      "child-3": { id: "child-3", role: "child", chance_features: true, display_name: "Robin", birth_month: 1, birth_year: thisYear - 12, theme_colour: "orange", location: "mountains", active_buddy_id: "buddy-robin-2", timed_missions: false, reset_streak_on_miss: true, equipped_items: ["hero-cape", "headset", "pickaxe", "pet-chick"], setup_complete: true },
      /* A parent: linked to Sky and Robin (see family_links). */
      "parent-1": { id: "parent-1", role: "parent", display_name: "Alex" },
      /* Another grown-up: linked to Jamie, Max and the new player (newplayer, no game name yet). */
      "parent-2": { id: "parent-2", role: "parent", display_name: "Sam" }
    },
    family_links: [
      { parent_id: "parent-1", child_id: "child-2", linked_on: shiftDate(today, -10) },
      { parent_id: "parent-1", child_id: "child-3", linked_on: shiftDate(today, -10) },
      { parent_id: "parent-2", child_id: "child-4", linked_on: shiftDate(today, -6) },
      { parent_id: "parent-2", child_id: "child-5", linked_on: shiftDate(today, -6) },
      { parent_id: "parent-2", child_id: "child-1", linked_on: today }
    ],
    link_codes: [],
    buddies: [
      { id: "buddy-sky-1", theme_colour: "blue", child_id: "child-2", pet_type: "seal", pet_name: "Biscuit", pet_look: { ...DEFAULT_PET_LOOK, face: "grin", arms: "wave", width: "chunky" }, adopted_on: shiftDate(today, -8) },
      { id: "buddy-robin-1", theme_colour: "yellow", child_id: "child-3", pet_type: "capybara", pet_name: "Nugget", pet_look: { ...DEFAULT_PET_LOOK, face: "grin", arms: "cheer" }, adopted_on: shiftDate(today, -9) },
      { id: "buddy-jamie-1", theme_colour: "teal", child_id: "child-4", pet_type: "axolotl", pet_name: "Pip", pet_look: { ...DEFAULT_PET_LOOK, arms: "wave", bodyColour: "lilac" }, adopted_on: shiftDate(today, -4) },
      { id: "buddy-max-1", theme_colour: "purple", child_id: "child-5", pet_type: "seal", pet_name: "Splash", pet_look: { ...DEFAULT_PET_LOOK, face: "cheeky" }, adopted_on: shiftDate(today, -3) },
      { id: "buddy-robin-2", theme_colour: "orange", child_id: "child-3", pet_type: "axolotl", pet_name: "Bubbles", pet_look: { ...DEFAULT_PET_LOOK, bodyColour: "mint" }, adopted_on: shiftDate(today, -2) }
    ],
    /* Test invites, so every account has something to see:
       Sky: 1 from Jamie, and has asked Max.   Robin: 1 from Max, and has asked Jamie.
       Jamie: 1 from Robin, and has asked Sky. Max: 1 from Sky, and has asked Robin. */
    friend_requests: [
      { id: "request-1", from_child_id: "child-4", to_child_id: "child-2", status: "pending", sent_on: today },
      { id: "request-2", from_child_id: "child-2", to_child_id: "child-5", status: "pending", sent_on: today },
      { id: "request-3", from_child_id: "child-3", to_child_id: "child-4", status: "pending", sent_on: today },
      { id: "request-4", from_child_id: "child-5", to_child_id: "child-3", status: "pending", sent_on: today }
    ],
    /* One row each way, created when a request is accepted. Sky and Robin are already friends. */
    friendships: [
      { child_id: "child-2", friend_id: "child-3" }, { child_id: "child-3", friend_id: "child-2" }
    ],
    chores: [
      { id: "chore-8", child_id: "child-3", title: "Tidy your room", active: true, sort_order: 1 },
      { id: "chore-9", child_id: "child-3", title: "Lay the table", active: true, sort_order: 2 },
      { id: "chore-10", child_id: "child-3", title: "Read for 10 minutes", active: true, sort_order: 3 },
      { id: "chore-4", child_id: "child-2", title: "Make your bed", active: true, sort_order: 1 },
      { id: "chore-5", child_id: "child-2", title: "Feed the fish", active: true, sort_order: 2 },
      { id: "chore-6", child_id: "child-2", title: "Plate in the dishwasher", active: true, sort_order: 3 },
      { id: "chore-7", child_id: "child-2", title: "Shoes on the rack", active: true, sort_order: 4 }
    ],
    chore_completions: [],
    own_tasks: [],
    scheduled_tasks: [
      { id: "schedule-1", child_id: "child-2", title: "Brush teeth", days_of_week: ["mon","tue","wed","thu","fri","sat","sun"], times_per_day: 2, active: true, set_by: "child" },
      { id: "schedule-2", child_id: "child-2", title: "Homework", days_of_week: ["mon","tue","wed","thu","fri"], times_per_day: 1, active: true, set_by: "parent" },
      { id: "schedule-3", child_id: "child-3", title: "Practise piano", days_of_week: ["mon","wed","fri"], times_per_day: 1, active: true, set_by: "parent" }
    ],
    scheduled_task_completions: [],
    /* Powers to try: Sky's sword is Master (Extra time + Brain boost), crown Advanced (Lucky), chick Advanced (Streak shield).
       Robin's cape is Master (Daring + Bonus mission), headset Master (Hint + Think again), pickaxe Master (Lucky + Treasure finder). */
    item_xp: [
      { child_id: "child-2", item_id: "pixel-sword", xp: 200 }, { child_id: "child-2", item_id: "crown", xp: 60 }, { child_id: "child-2", item_id: "pet-chick", xp: 60 },
      { child_id: "child-3", item_id: "hero-cape", xp: 200 }, { child_id: "child-3", item_id: "headset", xp: 200 }, { child_id: "child-3", item_id: "pickaxe", xp: 200 }
    ],
    /* Shop purchases. price_paid is stored so changing a price later doesn't change anyone's XP. */
    purchases: [],
    chance_rolls: [],
    /* Items a child has recoloured: { child_id, item_id, colour_id }. */
    item_colours: [ { child_id: "child-3", item_id: "hero-cape", colour_id: "purple" } ],
    mission_completions: []
  };
  [-1, -2, -3, -5, -6, -8].forEach(offset => {
    const day = shiftDate(today, offset);
    database.mission_completions.push({ child_id: "child-2", mission_id: "trivia-axolotl-regrow", completed_on: day, choice_index: 1, xp_awarded: 1 });
    database.mission_completions.push({ child_id: "child-2", mission_id: "puzzle-doubling", completed_on: day, choice_index: 2, xp_awarded: 2 });
    ["chore-4", "chore-5", "chore-6"].forEach(choreId => database.chore_completions.push({ child_id: "child-2", buddy_id: "buddy-sky-1", chore_id: choreId, completed_on: day }));
  });
  // A few "What would you do?" answers (some not the best choice) and Robin's quiz answers, for the parent's stats.
  const answered = (childId, missionId, offset, choiceIndex) => {
    const mission = MISSIONS.find(candidate => candidate.id === missionId);
    if (mission) database.mission_completions.push({ child_id: childId, mission_id: missionId, completed_on: shiftDate(today, offset), choice_index: choiceIndex, xp_awarded: xpForAnswer(mission, choiceIndex) });
  };
  answered("child-2", "scenario-tickling-stop", -1, 0); answered("child-2", "scenario-maybe-later", -2, 1); answered("child-2", "scenario-group-chat-photo", -3, 2);
  answered("child-3", "trivia-octopus-hearts", -1, 0); answered("child-3", "puzzle-sheep", -2, 1); answered("child-3", "scenario-game-server-snapchat", -3, 0);
  answered("child-3", "trivia-venus-day", -4, 1); answered("child-3", "scenario-maybe-later", -5, 0);
  // Robin's Nugget (level 100+) has already opened its milestone boxes.
  for (let level = MILESTONE_EVERY_LEVELS; level <= 100; level += MILESTONE_EVERY_LEVELS)
    database.chance_rolls.push({ child_id: "child-3", kind: "milestone", milestone_buddy_id: "buddy-robin-1", milestone_level: level, outcome: "won", won_item_id: null, xp_paid: 0, rolled_on: shiftDate(today, -30) });
  for (let offset = -1; offset >= -9; offset--) {
    const day = shiftDate(today, offset);
    ["chore-8", "chore-9", "chore-10"].forEach(choreId => database.chore_completions.push({ child_id: "child-3", buddy_id: "buddy-robin-2", chore_id: choreId, completed_on: day }));
  }
  return database;
}

function fakeXpEarned(childId) {
  const missionXp = fakeDatabase.mission_completions.filter(row => row.child_id === childId).reduce((total, row) => total + (row.xp_awarded || 0), 0);
  return missionXp + ((fakeDatabase.prototypeBonusXp || {})[childId] || 0);
}
function fakeXpSpentInShop(childId) {
  return fakeDatabase.purchases.filter(row => row.child_id === childId).reduce((total, row) => total + row.price_paid, 0)
    + fakeDatabase.chance_rolls.filter(row => row.child_id === childId).reduce((total, row) => total + (row.xp_paid || 0) - (row.xp_refunded || 0), 0);
}
/* Everything the child owns right now: level unlocks (by their best buddy level, minus anything swapped away),
   Shop purchases and things won by chance. */
function fakeOwnedItemIds(childId) {
  const rolls = fakeDatabase.chance_rolls.filter(row => row.child_id === childId);
  const won = new Set(rolls.map(row => row.won_item_id).filter(Boolean));
  const swappedAway = new Set(rolls.filter(row => row.kind === "gamble" && (row.outcome === "rarer" || row.outcome === "common")).map(row => row.risked_item_id));
  const bestLevel = fakeBestLevel(childId);
  const owned = new Set(won);
  INVENTORY_ITEMS.forEach(item => {
    if (item.unlockLevel !== undefined && item.unlockLevel <= bestLevel && !swappedAway.has(item.id)) owned.add(item.id);
  });
  fakeDatabase.purchases.filter(row => row.child_id === childId).forEach(row => owned.add(row.item_id));
  // Won back from a box after swapping it away counts as owned again.
  rolls.forEach(row => { if (row.won_item_id) owned.add(row.won_item_id); });
  return owned;
}
/* Highest level ever reached (stored, so un-ticking a task never takes unlocks away). */
function fakeBestLevel(childId) { return Math.max(1, fakeDatabase.profiles[childId].highest_level_reached || 1, ...Object.values(fakeBuddyLevelPoints(childId)).map(calculateLevel)); }
function fakeRecordHighestLevel(childId) { fakeDatabase.profiles[childId].highest_level_reached = fakeBestLevel(childId); }
function fakeItemColours(childId) { return Object.fromEntries(fakeDatabase.item_colours.filter(row => row.child_id === childId).map(row => [row.item_id, row.colour_id])); }
/* The level the child was when they got each Shop / chance item. */
function fakeGotAtLevels(childId) {
  const levels = {};
  const note = (itemId, level) => { if (itemId && level) levels[itemId] = Math.min(levels[itemId] ?? Infinity, level); };
  fakeDatabase.purchases.filter(row => row.child_id === childId).forEach(row => note(row.item_id, row.got_at_level));
  fakeDatabase.chance_rolls.filter(row => row.child_id === childId).forEach(row => note(row.won_item_id, row.won_at_level));
  return levels;
}
function gotAtLevelFor(item, gotAtLevels) {
  const fromLevelUp = item.unlockLevel !== undefined ? item.unlockLevel : Infinity;
  return Math.min(fromLevelUp, gotAtLevels[item.id] ?? Infinity);
}
function fakeItemXp(childId) { return Object.fromEntries(fakeDatabase.item_xp.filter(row => row.child_id === childId).map(row => [row.item_id, row.xp])); }
function fakeActivePowers(childId) { return activePowersFor(fakeDatabase.profiles[childId].equipped_items, fakeItemXp(childId)); }
function fakeXpToSpend(childId) { return fakeXpEarned(childId) - fakeXpSpentOnItems(childId) - fakeXpSpentInShop(childId); }
function fakeXpSpentOnItems(childId) {
  return fakeDatabase.item_xp.filter(row => row.child_id === childId).reduce((total, row) => total + row.xp, 0);
}
let fakeDatabase;
try { fakeDatabase = JSON.parse(localStorage.getItem(FAKE_STORAGE_KEY)); } catch (error) { fakeDatabase = null; }
if (!fakeDatabase || !fakeDatabase.users) fakeDatabase = buildFakeDatabase();
function persistFakeDatabase() { try { localStorage.setItem(FAKE_STORAGE_KEY, JSON.stringify(fakeDatabase)); } catch (error) {} }
function waitLikeANetwork() { return new Promise(resolve => setTimeout(resolve, 300)); }
async function fakeRequest(isWrite, work) {
  await waitLikeANetwork();
  if (isWrite && prototypeSettings.failSaves) throw new Error("save-failed");
  const result = work();
  if (isWrite) persistFakeDatabase();
  return result;
}
/* Total tasks on a date: set tasks + scheduled task occurrences on that weekday + own tasks added that day. */
function fakeTaskCountForDay(childId, isoDate) {
  const weekDay = getWeekDayIdInUk(isoDate);
  const setTasks = prototypeSettings.hideChores ? 0 : fakeDatabase.chores.filter(row => row.child_id === childId && row.active).length;
  const scheduled = fakeDatabase.scheduled_tasks.filter(row => row.child_id === childId && row.active && row.days_of_week.includes(weekDay))
    .reduce((total, row) => total + row.times_per_day, 0);
  const own = fakeDatabase.own_tasks.filter(row => row.child_id === childId && row.added_on === isoDate).length;
  return setTasks + scheduled + own;
}
function requireSignedInUserId() { if (!fakeDatabase.signedInUserId) throw new Error("not-signed-in"); return fakeDatabase.signedInUserId; }
/* Every "My…" function is for children only: a parent account has no buddy, tasks or link code of its own. */
function requireChildUserId() {
  const userId = requireSignedInUserId();
  if (fakeDatabase.profiles[userId].role !== "child") throw new Error("not-a-child");
  return userId;
}
/* The profile as the app sees it: the child's own fields plus their active buddy's pet. */
function profileForApp(childId) {
  const profile = fakeDatabase.profiles[childId];
  if (profile.role === "parent") return { ...profile };
  const buddy = fakeDatabase.buddies.find(row => row.id === profile.active_buddy_id);
  return { ...profile, equipped_items: [...profile.equipped_items],
    theme_colour: (buddy && buddy.theme_colour) || profile.theme_colour,
    child_can_change_settings: profile.child_can_change_settings !== false,
    grown_up_names: fakeDatabase.family_links.filter(row => row.child_id === childId).map(row => fakeDatabase.profiles[row.parent_id].display_name),
    pet_type: buddy ? buddy.pet_type : null, pet_name: buddy ? buddy.pet_name : "", pet_look: { ...DEFAULT_PET_LOOK, ...(buddy ? buddy.pet_look : {}) } };
}
function fakeActiveBuddy(childId) { return fakeDatabase.buddies.find(row => row.id === fakeDatabase.profiles[childId].active_buddy_id); }
/* Level points per buddy: every task row carries the buddy that was playing when it was ticked. */
function fakeBuddyLevelPoints(childId) {
  const points = {};
  fakeDatabase.buddies.filter(buddy => buddy.child_id === childId).forEach(buddy => {
    const forBuddy = row => row.child_id === childId && row.buddy_id === buddy.id;
    points[buddy.id] = fakeDatabase.chore_completions.filter(forBuddy).length
      + fakeDatabase.scheduled_task_completions.filter(forBuddy).length
      + fakeDatabase.own_tasks.filter(row => row.child_id === childId && row.done && row.done_by_buddy_id === buddy.id).length
      + (fakeDatabase.prototypeBonusLevelPoints[buddy.id] || 0);
  });
  return points;
}
function fakeProgressSummary(childId) {
  const today = getTodayInUk();
  const choreRows = fakeDatabase.chore_completions.filter(row => row.child_id === childId);
  const ownRows = fakeDatabase.own_tasks.filter(row => row.child_id === childId && row.done);
  const scheduledRows = fakeDatabase.scheduled_task_completions.filter(row => row.child_id === childId);
  const missionRows = fakeDatabase.mission_completions.filter(row => row.child_id === childId);
  const daysPlayedDates = [...new Set([...choreRows.map(row => row.completed_on), ...ownRows.map(row => row.added_on), ...scheduledRows.map(row => row.completed_on), ...missionRows.map(row => row.completed_on)])];
  const buddyLevelPoints = fakeBuddyLevelPoints(childId), activeBuddyId = fakeDatabase.profiles[childId].active_buddy_id;
  return {
    levelPoints: buddyLevelPoints[activeBuddyId] || 0,
    highestLevelReached: fakeBestLevel(childId),
    buddyLevelPoints,
    xpEarned: fakeXpEarned(childId),
    xpSpentOnItems: fakeXpSpentOnItems(childId),
    xpSpentInShop: fakeXpSpentInShop(childId),
    daysPlayedTotal: daysPlayedDates.length, daysPlayedDates,
    missionsDoneToday: missionRows.filter(row => row.completed_on === today).map(row => ({ missionId: row.mission_id, xpAwarded: row.xp_awarded })),
    hintsUsedToday: missionRows.filter(row => row.completed_on === today && row.used_hint).length,
    thinkAgainsUsedToday: missionRows.filter(row => row.completed_on === today && row.used_think_again).length,
    missionsLastDoneOn: missionRows.filter(row => row.completed_on < today)
      .reduce((lastDone, row) => ({ ...lastDone, [row.mission_id]: row.completed_on > (lastDone[row.mission_id] || "") ? row.completed_on : lastDone[row.mission_id] }), {})
  };
}
/* Birth month (1–12) and year, checked: the child must be MIN_CHILD_AGE to MAX_CHILD_AGE now. Throws Error("bad-birth-month"). */
function checkBirthMonth(birthMonth, birthYear) {
  const age = Number.isInteger(birthMonth) && Number.isInteger(birthYear) && birthMonth >= 1 && birthMonth <= 12 ? ageFromBirthMonth(birthMonth, birthYear) : null;
  if (age === null || age < MIN_CHILD_AGE || age > MAX_CHILD_AGE) throw new Error("bad-birth-month");
  return age;
}

/* ---------- Parent accounts ----------
   family_links (parent_id, child_id, linked_on): which grown-ups look after which children.
   A grown-up adds their children (addChild), so every child has at least one grown-up from the start.
   link_codes (child_id, code, expires_at): a grown-up makes an invite code on a child's tab; another grown-up types it
     into "+ Add a child" to share that child. Used once, lasts LINK_CODE_HOURS. A child's last grown-up can't unlink;
     they can delete the child's account instead.
   profiles.child_can_change_settings (default true): false = only a linked parent can change timers, chance and streak.
   scheduled_tasks.set_by "child"|"parent": a child can't remove a task a parent set.
   Supabase: every parent function must check a family_links row exists for (auth.uid(), child_id), in RLS or in
   database functions. Every child ("My…") function must check the signed-in profile's role is "child", and a link code
   must belong to a child. When a child's LAST link is removed: child_can_change_settings goes back to true and the
   parent's tasks become the child's own (set_by "child"), so the child is never left locked out. Parents see their own children's tasks, settings and stats only, never friends or search. */
const LINK_CODE_HOURS = 24;
const MAX_CHILDREN_PER_GROWN_UP = 8;
const MAX_NAME_LENGTH = 16; // a child's name in Voxie (the setup screen uses the same limit)
const LINK_CODE_LETTERS = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // no 0/O or 1/I/L, so it's easy to read out
function requireParentUserId() {
  const userId = requireSignedInUserId();
  if (fakeDatabase.profiles[userId].role !== "parent") throw new Error("not-a-parent");
  return userId;
}
function requireMyChild(childId) {
  const parentId = requireParentUserId();
  if (!fakeDatabase.family_links.some(row => row.parent_id === parentId && row.child_id === childId)) throw new Error("not-your-child");
  return parentId;
}
function fakeScheduledTaskShape(row) { return { id: row.id, title: row.title, daysOfWeek: [...row.days_of_week], timesPerDay: row.times_per_day, setBy: row.set_by || "child" }; }
/* Adds a scheduled task for a child (by the child or their parent), keeping every day within MAX_TASKS_PER_DAY. */
function fakeAddScheduledTask(childId, task, setBy) {
  if (fakeDatabase.scheduled_tasks.filter(row => row.child_id === childId && row.active).length >= MAX_SCHEDULED_TASKS) throw new Error("limit");
  const setTasks = fakeDatabase.chores.filter(row => row.child_id === childId && row.active).length;
  const today = getTodayInUk(), todayWeekDay = getWeekDayIdInUk(today);
  const ownTasksToday = fakeDatabase.own_tasks.filter(row => row.child_id === childId && row.added_on === today).length;
  const tooFullOnSomeDay = task.daysOfWeek.some(weekDay => setTasks + task.timesPerDay + (weekDay === todayWeekDay ? ownTasksToday : 0)
    + fakeDatabase.scheduled_tasks.filter(row => row.child_id === childId && row.active && row.days_of_week.includes(weekDay)).reduce((total, row) => total + row.times_per_day, 0) > MAX_TASKS_PER_DAY);
  if (tooFullOnSomeDay) throw new Error("daily-limit");
  const row = { id: "schedule-" + Date.now(), child_id: childId, title: task.title, days_of_week: [...task.daysOfWeek], times_per_day: task.timesPerDay, active: true, set_by: setBy };
  fakeDatabase.scheduled_tasks.push(row);
  return fakeScheduledTaskShape(row);
}
/* The child as their parent sees them: name and buddy (for the tab picture). */
function fakeChildForParent(childId) {
  const child = profileForApp(childId), progress = fakeProgressSummary(childId), level = calculateLevel(progress.levelPoints);
  const username = (fakeDatabase.users.find(user => user.id === childId) || {}).username || "New player";
  return { id: childId, displayName: child.display_name || username, setupComplete: !!child.setup_complete, level, petName: child.pet_name,
    look: child.setup_complete ? { ...lookFromProfile(child), level, equipped: child.equipped_items, itemColours: fakeItemColours(childId) } : null };
}
/* Stats for the parent. Tasks set on a past day are worked out from today's task list (the real version should
   store each day's task count when the day ends, so changing tasks doesn't rewrite history). */
function fakeChildStats(childId) {
  const today = getTodayInUk(), profile = fakeDatabase.profiles[childId];
  const tasksDoneOn = date => fakeDatabase.chore_completions.filter(row => row.child_id === childId && row.completed_on === date).length
    + fakeDatabase.scheduled_task_completions.filter(row => row.child_id === childId && row.completed_on === date).length
    + fakeDatabase.own_tasks.filter(row => row.child_id === childId && row.added_on === date && row.done).length;
  const lastSevenDays = [6, 5, 4, 3, 2, 1, 0].map(daysAgo => {
    const date = shiftDate(today, -daysAgo), done = tasksDoneOn(date);
    return { date, weekDay: getWeekDayIdInUk(date), done, set: Math.max(done, fakeTaskCountForDay(childId, date)) };
  });
  const missionRows = fakeDatabase.mission_completions.filter(row => row.child_id === childId);
  // "Questions right" counts quiz and scenario answers only: Feel good missions have no right answer.
  const answered = missionRows.map(row => ({ row, mission: MISSIONS.find(mission => mission.id === row.mission_id) })).filter(entry => entry.mission && !isChallenge(entry.mission));
  const progress = fakeProgressSummary(childId);
  return {
    lastSevenDays,
    tasksDoneToday: lastSevenDays[6].done, tasksSetToday: lastSevenDays[6].set,
    tasksDoneThisWeek: lastSevenDays.reduce((total, day) => total + day.done, 0),
    tasksSetThisWeek: lastSevenDays.reduce((total, day) => total + day.set, 0),
    missionsDoneToday: missionRows.filter(row => row.completed_on === today).length,
    missionsDoneThisWeek: missionRows.filter(row => row.completed_on >= lastSevenDays[0].date).length,
    missionsPossibleThisWeek: 7 * MAX_MISSIONS_PER_DAY,
    feelGoodDoneThisWeek: missionRows.filter(row => row.completed_on >= lastSevenDays[0].date && row.did_it).length,
    questionsAnswered: answered.length,
    questionsRight: answered.filter(entry => isRightAnswer(entry.mission, entry.row.choice_index)).length,
    streak: calculateStreak(progress.daysPlayedDates, today, profile.reset_streak_on_miss !== false, fakeActivePowers(childId)["streak-shield"] || 0)
  };
}

const dataLayer = {
  /** The signed-in child's profile, or null. */
  async getSignedInProfile() {
    return fakeRequest(false, () => fakeDatabase.signedInUserId ? profileForApp(fakeDatabase.signedInUserId) : null);
  },
  /** loginName = a grown-up's email or a child's username. Throws Error("wrong-details") if it doesn't match. Returns the profile. */
  async signIn(loginName, passcode) {
    return fakeRequest(false, () => {
      const name = loginName.trim().toLowerCase(), byEmail = name.includes("@");
      const user = fakeDatabase.users.find(candidate => (byEmail ? candidate.email === name : candidate.username === name) && candidate.passcode === passcode);
      if (!user) throw new Error("wrong-details");
      fakeDatabase.signedInUserId = user.id;
      persistFakeDatabase();
      return profileForApp(user.id);
    });
  },
  /** Grown-ups only: emails a link to make a new password. Always "succeeds", so it never reveals which emails have accounts. */
  async requestPasscodeReset(email) {
    return fakeRequest(false, () => { /* Supabase: auth.resetPasswordForEmail(email, { redirectTo }) */ });
  },
  async signOut() { return fakeRequest(false, () => { fakeDatabase.signedInUserId = null; persistFakeDatabase(); }); },
  /** First-time setup. look = { displayName, petType, petName, themeColour, location, petLook }.
      Creates the child's first buddy and makes it active. Returns the profile. */
  async saveProfileSetup(look) {
    return fakeRequest(true, () => {
      const childId = requireChildUserId(), profile = fakeDatabase.profiles[childId];
      let buddy = fakeActiveBuddy(childId);
      if (!buddy) { buddy = { id: `buddy-${childId}-${Date.now()}`, child_id: childId, adopted_on: getTodayInUk() }; fakeDatabase.buddies.push(buddy); }
      Object.assign(buddy, { pet_type: look.petType, pet_name: look.petName, pet_look: { ...look.petLook }, theme_colour: look.themeColour });
      Object.assign(profile, { display_name: look.displayName, location: look.location, active_buddy_id: buddy.id, setup_complete: true });
      return profileForApp(childId);
    });
  },
  /** Changes from the Buddies screen. Same look shape as saveProfileSetup.
      The pet's look is saved on the ACTIVE buddy; colour and location on the child. Returns the profile. */
  async updateMyProfile(look) {
    return fakeRequest(true, () => {
      const childId = requireChildUserId(), profile = fakeDatabase.profiles[childId], buddy = fakeActiveBuddy(childId);
      Object.assign(profile, { display_name: look.displayName, location: look.location });
      if (buddy) Object.assign(buddy, { pet_look: { ...look.petLook }, theme_colour: look.themeColour });
      return profileForApp(childId);
    });
  },
  /** [{ id, petType, petName, petLook, themeColour, isActive }] oldest first. */
  async loadMyBuddies() {
    return fakeRequest(false, () => {
      const childId = requireChildUserId(), activeId = fakeDatabase.profiles[childId].active_buddy_id;
      return fakeDatabase.buddies.filter(row => row.child_id === childId)
        .map(row => ({ id: row.id, petType: row.pet_type, petName: row.pet_name, petLook: { ...DEFAULT_PET_LOOK, ...row.pet_look }, themeColour: row.theme_colour, isActive: row.id === activeId }));
    });
  },
  /** Rebirth: starts a NEW pet type at level 1 and makes it the one playing. The old buddy is kept (as an angel).
      Throws Error("no-rebirth") if no buddy has earned one (every 100 levels), Error("already-collected") if they
      already have that pet type. Supabase: a database function, so both checks happen on the server. Returns the profile. */
  async rebirthAsNewPet(petType, petName) {
    return fakeRequest(true, () => {
      const childId = requireChildUserId();
      const levels = Object.values(fakeBuddyLevelPoints(childId)).map(calculateLevel);
      if (rebirthsAvailable(levels) < 1) throw new Error("no-rebirth");
      if (!PET_TYPES[petType]) throw new Error("unknown-pet");
      if (fakeDatabase.buddies.some(row => row.child_id === childId && row.pet_type === petType)) throw new Error("already-collected");
      const startColour = profileForApp(childId).theme_colour;   // a new buddy starts with the colour you're using now
      const buddy = { id: `buddy-${childId}-${Date.now()}`, child_id: childId, pet_type: petType, pet_name: petName, pet_look: { ...DEFAULT_PET_LOOK }, theme_colour: startColour, adopted_on: getTodayInUk() };
      fakeDatabase.buddies.push(buddy);
      fakeDatabase.profiles[childId].active_buddy_id = buddy.id;
      return profileForApp(childId);
    });
  },
  /** Brings out a different buddy (must be one of theirs). Returns the profile. */
  async setActiveBuddy(buddyId) {
    return fakeRequest(true, () => {
      const childId = requireChildUserId();
      if (!fakeDatabase.buddies.some(row => row.id === buddyId && row.child_id === childId)) throw new Error("not-your-buddy");
      fakeDatabase.profiles[childId].active_buddy_id = buddyId;
      return profileForApp(childId);
    });
  },
  /** Players whose name contains the search (2+ letters), not you, set up only:
      [{ id, displayName, petType, petLook, relationship: "friend"|"request-sent"|"request-received"|"none", requestId }] */
  async searchPlayers(searchText) {
    return fakeRequest(false, () => {
      const childId = requireChildUserId(), search = searchText.trim().toLowerCase();
      if (search.length < 2) return [];
      return Object.values(fakeDatabase.profiles)
        .filter(profile => profile.role === "child" && profile.id !== childId && profile.setup_complete && profile.display_name.toLowerCase().includes(search))
        .slice(0, 10)
        .map(profile => {
          const player = profileForApp(profile.id);
          const pending = fakeDatabase.friend_requests.find(row => row.status === "pending"
            && ((row.from_child_id === childId && row.to_child_id === player.id) || (row.from_child_id === player.id && row.to_child_id === childId)));
          const isFriend = fakeDatabase.friendships.some(row => row.child_id === childId && row.friend_id === player.id);
          return { id: player.id, displayName: player.display_name, petType: player.pet_type, petLook: player.pet_look, requestId: pending ? pending.id : null,
            relationship: isFriend ? "friend" : pending ? (pending.from_child_id === childId ? "request-sent" : "request-received") : "none" };
        });
    });
  },
  /** Throws Error("already-friends") or Error("already-asked"). */
  async sendFriendRequest(toChildId) {
    return fakeRequest(true, () => {
      const childId = requireChildUserId();
      if (toChildId === childId || !fakeDatabase.profiles[toChildId]) throw new Error("not-found");
      if (fakeDatabase.friendships.some(row => row.child_id === childId && row.friend_id === toChildId)) throw new Error("already-friends");
      if (fakeDatabase.friend_requests.some(row => row.status === "pending" && ((row.from_child_id === childId && row.to_child_id === toChildId) || (row.from_child_id === toChildId && row.to_child_id === childId)))) throw new Error("already-asked");
      fakeDatabase.friend_requests.push({ id: `request-${Date.now()}`, from_child_id: childId, to_child_id: toChildId, status: "pending", sent_on: getTodayInUk() });
    });
  },
  /** Requests sent TO you that are waiting: [{ id, fromChildId, displayName, petType, petLook }] (newest first). */
  async loadMyFriendRequests() {
    return fakeRequest(false, () => {
      const childId = requireChildUserId();
      return fakeDatabase.friend_requests.filter(row => row.to_child_id === childId && row.status === "pending").reverse()
        .map(row => { const from = profileForApp(row.from_child_id); return { id: row.id, fromChildId: from.id, displayName: from.display_name, petType: from.pet_type, petLook: from.pet_look }; });
    });
  },
  /** Stops being friends, both ways. They can be asked again later. */
  async removeFriend(friendId) {
    return fakeRequest(true, () => {
      const childId = requireChildUserId();
      fakeDatabase.friendships = fakeDatabase.friendships.filter(row => !((row.child_id === childId && row.friend_id === friendId) || (row.child_id === friendId && row.friend_id === childId)));
    });
  },
  /** Requests YOU sent that are still waiting: [{ id, toChildId, displayName, petType, petLook }] (newest first). */
  async loadMySentFriendRequests() {
    return fakeRequest(false, () => {
      const childId = requireChildUserId();
      return fakeDatabase.friend_requests.filter(row => row.from_child_id === childId && row.status === "pending").reverse()
        .map(row => { const to = profileForApp(row.to_child_id); return { id: row.id, toChildId: to.id, displayName: to.display_name, petType: to.pet_type, petLook: to.pet_look }; });
    });
  },
  /** Takes back a request you sent that's still waiting. */
  async cancelFriendRequest(requestId) {
    return fakeRequest(true, () => {
      const childId = requireChildUserId();
      const request = fakeDatabase.friend_requests.find(row => row.id === requestId && row.from_child_id === childId && row.status === "pending");
      if (request) request.status = "cancelled";
    });
  },
  /** Accept (true) or say no thanks (false). Accepting makes you friends both ways. */
  async answerFriendRequest(requestId, accept) {
    return fakeRequest(true, () => {
      const childId = requireChildUserId();
      const request = fakeDatabase.friend_requests.find(row => row.id === requestId && row.to_child_id === childId && row.status === "pending");
      if (!request) throw new Error("not-found");
      request.status = accept ? "accepted" : "declined";
      if (accept) fakeDatabase.friendships.push({ child_id: childId, friend_id: request.from_child_id }, { child_id: request.from_child_id, friend_id: childId });
    });
  },
  /** Your friends who have finished setting up, with only what's safe to show:
      [{ id, displayName, setupComplete, level (their playing buddy's), xpEarned,
         look:{ petType, petName, petLook, themeColour, location, level, equipped, retiredBuddies:[{ petType, petLook }] } }] */
  async loadMyFriends() {
    return fakeRequest(false, () => {
      const childId = requireChildUserId(), today = getTodayInUk();
      return fakeDatabase.friendships.filter(row => row.child_id === childId && fakeDatabase.profiles[row.friend_id].setup_complete).map(row => {
        const friend = profileForApp(row.friend_id), progress = fakeProgressSummary(row.friend_id), level = calculateLevel(progress.levelPoints);
        const friendBuddies = fakeDatabase.buddies.filter(buddy => buddy.child_id === friend.id);
        return {
          id: friend.id, displayName: friend.display_name, setupComplete: friend.setup_complete, level,
          xpEarned: progress.xpEarned,
          look: { ...lookFromProfile(friend), level, equipped: friend.equipped_items, itemColours: fakeItemColours(friend.id),
            retiredBuddies: friendBuddies.filter(buddy => buddy.id !== friend.active_buddy_id).map(buddy => ({ petType: buddy.pet_type, petLook: { ...DEFAULT_PET_LOOK, ...buddy.pet_look } })) }
        };
      }).sort((first, second) => (first.displayName || "").localeCompare(second.displayName || ""));
    });
  },
  /** settings = { timedMissions, resetStreakOnMiss, chanceFeatures }. All default to on for new children. Returns the profile. */
  async updateMySettings(settings) {
    return fakeRequest(true, () => {
      const childId = requireChildUserId();
      if (fakeDatabase.profiles[childId].child_can_change_settings === false) throw new Error("set-by-grown-up");
      Object.assign(fakeDatabase.profiles[childId], { timed_missions: settings.timedMissions, reset_streak_on_miss: settings.resetStreakOnMiss, chance_features: settings.chanceFeatures !== false });
      return profileForApp(childId);
    });
  },
  /** Saves which collected inventory items are in use (worn, held or put out). Returns the profile. */
  async updateEquippedItems(itemIds) {
    return fakeRequest(true, () => {
      const childId = requireChildUserId();
      fakeDatabase.profiles[childId].equipped_items = [...itemIds];
      return profileForApp(childId);
    });
  },
  async loadMyChores() {
    return fakeRequest(false, () => {
      if (prototypeSettings.hideChores) return [];
      const childId = requireChildUserId();
      return fakeDatabase.chores.filter(chore => chore.child_id === childId && chore.active)
        .sort((first, second) => first.sort_order - second.sort_order).map(chore => ({ id: chore.id, title: chore.title }));
    });
  },
  /** Tasks the child added themselves today: [{ id, title, done }] */
  async loadMyOwnTasksToday() {
    return fakeRequest(false, () => {
      const childId = requireChildUserId(), today = getTodayInUk();
      return fakeDatabase.own_tasks.filter(row => row.child_id === childId && row.added_on === today)
        .map(row => ({ id: row.id, title: row.title, done: row.done }));
    });
  },
  /** Adds a task for today. Throws Error("daily-limit") if today already has MAX_TASKS_PER_DAY tasks in total. Returns { id, title, done }. */
  async addMyOwnTask(title) {
    return fakeRequest(true, () => {
      const childId = requireChildUserId(), today = getTodayInUk();
      if (fakeTaskCountForDay(childId, today) >= MAX_TASKS_PER_DAY) throw new Error("daily-limit");
      const row = { id: "own-" + Date.now(), child_id: childId, title, added_on: today, done: false };
      fakeDatabase.own_tasks.push(row);
      return { id: row.id, title: row.title, done: row.done };
    });
  },
  async setMyOwnTaskDone(ownTaskId, done) {
    return fakeRequest(true, () => {
      const row = fakeDatabase.own_tasks.find(candidate => candidate.id === ownTaskId && candidate.child_id === requireChildUserId());
      if (row) { row.done = done; row.done_by_buddy_id = done ? fakeDatabase.profiles[row.child_id].active_buddy_id : null; fakeRecordHighestLevel(row.child_id); }
    });
  },
  /** Only allowed while the task isn't ticked. */
  async removeMyOwnTask(ownTaskId) {
    return fakeRequest(true, () => {
      const childId = requireChildUserId();
      fakeDatabase.own_tasks = fakeDatabase.own_tasks.filter(row => !(row.id === ownTaskId && row.child_id === childId && !row.done));
    });
  },
  /** All of the child's active scheduled tasks. */
  async loadMyScheduledTasks() {
    return fakeRequest(false, () => {
      const childId = requireChildUserId();
      return fakeDatabase.scheduled_tasks.filter(row => row.child_id === childId && row.active).map(fakeScheduledTaskShape);
    });
  },
  /** task = { title, daysOfWeek, timesPerDay }. Throws Error("limit") past MAX_SCHEDULED_TASKS, or
      Error("daily-limit") if it would take any day over MAX_TASKS_PER_DAY. Returns the saved task. */
  async addMyScheduledTask(task) {
    return fakeRequest(true, () => {
      return fakeAddScheduledTask(requireChildUserId(), task, "child");
    });
  },
  /** Stops it appearing from now on. Points already earned from it are kept. */
  async removeMyScheduledTask(scheduledTaskId) {
    return fakeRequest(true, () => {
      const row = fakeDatabase.scheduled_tasks.find(candidate => candidate.id === scheduledTaskId && candidate.child_id === requireChildUserId());
      if (row && row.set_by === "parent") throw new Error("set-by-grown-up");
      if (row) row.active = false;
    });
  },
  /** Which scheduled-task occurrences are ticked today: [{ scheduledTaskId, occurrence }] (occurrence starts at 1). */
  async loadScheduledTasksDoneToday() {
    return fakeRequest(false, () => {
      const childId = requireChildUserId(), today = getTodayInUk();
      return fakeDatabase.scheduled_task_completions.filter(row => row.child_id === childId && row.completed_on === today)
        .map(row => ({ scheduledTaskId: row.scheduled_task_id, occurrence: row.occurrence }));
    });
  },
  async markScheduledTaskDone(scheduledTaskId, occurrence) {
    return fakeRequest(true, () => {
      const childId = requireChildUserId(), today = getTodayInUk();
      if (!fakeDatabase.scheduled_task_completions.some(row => row.child_id === childId && row.scheduled_task_id === scheduledTaskId && row.occurrence === occurrence && row.completed_on === today))
        fakeDatabase.scheduled_task_completions.push({ child_id: childId, buddy_id: fakeDatabase.profiles[childId].active_buddy_id, scheduled_task_id: scheduledTaskId, occurrence, completed_on: today });
      fakeRecordHighestLevel(childId);
    });
  },
  async unmarkScheduledTaskDone(scheduledTaskId, occurrence) {
    return fakeRequest(true, () => {
      const childId = requireChildUserId(), today = getTodayInUk();
      fakeDatabase.scheduled_task_completions = fakeDatabase.scheduled_task_completions.filter(row =>
        !(row.child_id === childId && row.scheduled_task_id === scheduledTaskId && row.occurrence === occurrence && row.completed_on === today));
    });
  },
  /** XP that has been put into each item: { itemId: xp }. Items not listed have 0. */
  async loadMyItemXp() {
    return fakeRequest(false, () => {
      const childId = requireChildUserId();
      return Object.fromEntries(fakeDatabase.item_xp.filter(row => row.child_id === childId).map(row => [row.item_id, row.xp]));
    });
  },
  /** Puts some of the child's spare XP into one item. amount must be a whole number from 1 up to the XP they have to spend.
      Throws Error("not-enough-xp") if they don't have that much.
      Supabase: do this as a database function (rpc "add_xp_to_item") so the "has enough XP" check happens on the server,
      then upsert item_xp (child_id, item_id) adding amount. Returns the item's new XP total. */
  async addXpToItem(itemId, amount) {
    return fakeRequest(true, () => {
      const childId = requireChildUserId();
      if (!Number.isInteger(amount) || amount < 1) throw new Error("bad-amount");
      if (amount > fakeXpToSpend(childId)) throw new Error("not-enough-xp");
      let row = fakeDatabase.item_xp.find(candidate => candidate.child_id === childId && candidate.item_id === itemId);
      if (!row) { row = { child_id: childId, item_id: itemId, xp: 0 }; fakeDatabase.item_xp.push(row); }
      row.xp += amount;
      return row.xp;
    });
  },
  /** { itemColours: { itemId: colourId }, gotAtLevels: { itemId: level } } for Shop and chance items. */
  async loadMyItemColours() {
    return fakeRequest(false, () => {
      const childId = requireChildUserId();
      return { itemColours: fakeItemColours(childId), gotAtLevels: fakeGotAtLevels(childId) };
    });
  },
  /** Recolours an item ("original" puts it back). Throws Error("not-owned") or Error("locked"). */
  async setItemColour(itemId, colourId) {
    return fakeRequest(true, () => {
      const childId = requireChildUserId(), item = getInventoryItem(itemId);
      if (!item || !fakeOwnedItemIds(childId).has(itemId)) throw new Error("not-owned");
      if (!ITEM_COLOUR_OPTIONS.some(option => option.id === colourId)) throw new Error("unknown-colour");
      if (fakeBestLevel(childId) < recolourUnlockLevel(item, gotAtLevelFor(item, fakeGotAtLevels(childId)))) throw new Error("locked");
      fakeDatabase.item_colours = fakeDatabase.item_colours.filter(row => !(row.child_id === childId && row.item_id === itemId));
      if (colourId !== "original") fakeDatabase.item_colours.push({ child_id: childId, item_id: itemId, colour_id: colourId });
    });
  },
  /** Ids of Shop items this child has bought. */
  async loadMyPurchases() {
    return fakeRequest(false, () => {
      const childId = requireChildUserId();
      return fakeDatabase.purchases.filter(row => row.child_id === childId).map(row => row.item_id);
    });
  },
  /** Buys a Shop item with XP. Throws Error("not-for-sale"), Error("already-owned") or Error("not-enough-xp").
      Supabase: do this as a database function (rpc "buy_item") so the price and XP check happen on the server.
      The price comes from the item list, never from the app. */
  async buyItem(itemId) {
    return fakeRequest(true, () => {
      const childId = requireChildUserId(), item = getInventoryItem(itemId);
      if (!item || !item.xpPrice) throw new Error("not-for-sale");
      if (fakeDatabase.purchases.some(row => row.child_id === childId && row.item_id === itemId)) throw new Error("already-owned");
      const price = shopPrice(item, fakeActivePowers(childId).bargain || 0);
      if (price > fakeXpToSpend(childId)) throw new Error("not-enough-xp");
      fakeDatabase.purchases.push({ child_id: childId, item_id: itemId, price_paid: price, bought_on: getTodayInUk(), got_at_level: fakeBestLevel(childId) });
      return { pricePaid: price };
    });
  },
  /** { wonItemIds, swappedAwayItemIds, triedItemIds (decided: took a chance or kept), boxesOpenedToday, treasureClaimedThisWeek,
        claimedMilestones: ["buddyId:level"] } */
  async loadMyChanceHistory() {
    return fakeRequest(false, () => {
      const childId = requireChildUserId(), today = getTodayInUk();
      const rolls = fakeDatabase.chance_rolls.filter(row => row.child_id === childId);
      const gambles = rolls.filter(row => row.kind === "gamble");
      return {
        wonItemIds: [...new Set(rolls.map(row => row.won_item_id).filter(Boolean))],
        swappedAwayItemIds: gambles.filter(row => row.outcome === "rarer" || row.outcome === "common").map(row => row.risked_item_id),
        triedItemIds: gambles.map(row => row.risked_item_id),
        boxesOpenedToday: rolls.filter(row => row.kind === "box" && row.rolled_on === today).length,
        treasureClaimedThisWeek: rolls.some(row => row.kind === "treasure" && weekStartOf(row.rolled_on) === weekStartOf(today)),
        claimedMilestones: rolls.filter(row => row.kind === "milestone").map(row => `${row.milestone_buddy_id}:${row.milestone_level}`)
      };
    });
  },
  /** Opens a Mystery box for MYSTERY_BOX_PRICE XP. Returns { wonItemId, chance, duplicate, xpBack }.
      A duplicate (already owned) gives DUPLICATE_XP_BACK XP back. Throws Error("chance-off"), Error("daily-limit") or Error("not-enough-xp"). */
  async openMysteryBox() {
    return fakeRequest(true, () => {
      const childId = requireChildUserId(), today = getTodayInUk();
      if (!fakeDatabase.profiles[childId].chance_features) throw new Error("chance-off");
      if (fakeDatabase.chance_rolls.filter(row => row.child_id === childId && row.kind === "box" && row.rolled_on === today).length >= MYSTERY_BOXES_PER_DAY) throw new Error("daily-limit");
      if (fakeXpToSpend(childId) < MYSTERY_BOX_PRICE) throw new Error("not-enough-xp");
      const owned = fakeOwnedItemIds(childId), prizes = mysteryBoxChances(itemId => owned.has(itemId), fakeActivePowers(childId).lucky || 0);
      if (!prizes.length) throw new Error("sold-out");
      const prize = pickByChance(prizes, prototypeSettings.forcedRandom ?? Math.random());
      const xpBack = prize.duplicate ? DUPLICATE_XP_BACK[prize.item.rarity] : 0;
      fakeDatabase.chance_rolls.push({ child_id: childId, kind: "box", risked_item_id: null, outcome: prize.duplicate ? "duplicate" : "won", won_item_id: prize.item.id, chance: prize.chance, xp_paid: MYSTERY_BOX_PRICE, xp_refunded: xpBack, rolled_on: today, won_at_level: fakeBestLevel(childId) });
      return { wonItemId: prize.item.id, chance: prize.chance, duplicate: prize.duplicate, xpBack };
    });
  },
  /** "Keep it" in the New item pop-up: records the decision so the chance can't be taken later. */
  async keepNewItem(itemId) {
    return fakeRequest(true, () => {
      const childId = requireChildUserId();
      if (fakeDatabase.chance_rolls.some(row => row.child_id === childId && row.kind === "gamble" && row.risked_item_id === itemId)) return;
      fakeDatabase.chance_rolls.push({ child_id: childId, kind: "gamble", risked_item_id: itemId, outcome: "declined", won_item_id: null, chance: null, xp_paid: 0, rolled_on: getTodayInUk() });
    });
  },
  /** Treasure finder power: one free surprise item a week (Monday to Sunday). Returns { wonItemId, chance }.
      Throws Error("no-power"), Error("already-claimed") or Error("sold-out"). */
  async claimWeeklyTreasure() {
    return fakeRequest(true, () => {
      const childId = requireChildUserId(), today = getTodayInUk(), powers = fakeActivePowers(childId);
      if (!powers["treasure-finder"]) throw new Error("no-power");
      if (fakeDatabase.chance_rolls.some(row => row.child_id === childId && row.kind === "treasure" && weekStartOf(row.rolled_on) === weekStartOf(today))) throw new Error("already-claimed");
      const owned = fakeOwnedItemIds(childId), prizes = mysteryBoxChances(itemId => owned.has(itemId), powers.lucky || 0);
      if (!prizes.length) throw new Error("sold-out");
      const prize = pickByChance(prizes, prototypeSettings.forcedRandom ?? Math.random());
      const xpBack = prize.duplicate ? DUPLICATE_XP_BACK[prize.item.rarity] : 0;
      fakeDatabase.chance_rolls.push({ child_id: childId, kind: "treasure", risked_item_id: null, outcome: prize.duplicate ? "duplicate" : "won", won_item_id: prize.item.id, chance: prize.chance, xp_paid: 0, xp_refunded: xpBack, rolled_on: today, won_at_level: fakeBestLevel(childId) });
      return { wonItemId: prize.item.id, chance: prize.chance, duplicate: prize.duplicate, xpBack };
    });
  },
  /** Milestone reward: a free Mystery box for every MILESTONE_EVERY_LEVELS levels a buddy reaches (once each).
      Returns { wonItemId, chance, duplicate, xpBack }. Throws Error("not-reached") or Error("already-claimed"). */
  async claimMilestoneBox(buddyId, level) {
    return fakeRequest(true, () => {
      const childId = requireChildUserId(), today = getTodayInUk();
      const buddy = fakeDatabase.buddies.find(row => row.id === buddyId && row.child_id === childId);
      if (!buddy || level % MILESTONE_EVERY_LEVELS !== 0 || calculateLevel(fakeBuddyLevelPoints(childId)[buddyId] || 0) < level) throw new Error("not-reached");
      if (fakeDatabase.chance_rolls.some(row => row.child_id === childId && row.kind === "milestone" && row.milestone_buddy_id === buddyId && row.milestone_level === level)) throw new Error("already-claimed");
      const owned = fakeOwnedItemIds(childId), prizes = mysteryBoxChances(itemId => owned.has(itemId), fakeActivePowers(childId).lucky || 0);
      const prize = pickByChance(prizes, prototypeSettings.forcedRandom ?? Math.random());
      const xpBack = prize.duplicate ? DUPLICATE_XP_BACK[prize.item.rarity] : 0;
      fakeDatabase.chance_rolls.push({ child_id: childId, kind: "milestone", milestone_buddy_id: buddyId, milestone_level: level, outcome: prize.duplicate ? "duplicate" : "won", won_item_id: prize.item.id, chance: prize.chance, xp_paid: 0, xp_refunded: xpBack, rolled_on: today, won_at_level: fakeBestLevel(childId) });
      return { wonItemId: prize.item.id, chance: prize.chance, duplicate: prize.duplicate, xpBack };
    });
  },
  /** Take a chance on an item JUST unlocked by levelling up (unlock level = their highest level), once. Returns { outcome: "rarer"|"keep"|"common",
      wonItemId, chance, profile }. If an outcome has nothing to give (all collected), it becomes "keep". */
  async takeAChance(itemId) {
    return fakeRequest(true, () => {
      const childId = requireChildUserId(), item = getInventoryItem(itemId), profile = fakeDatabase.profiles[childId];
      if (!profile.chance_features) throw new Error("chance-off");
      if (!item || item.unlockLevel === undefined) throw new Error("cannot-take-a-chance");
      const owned = fakeOwnedItemIds(childId), isOwned = candidateId => owned.has(candidateId);
      if (!owned.has(itemId)) throw new Error("not-owned");
      if (fakeDatabase.chance_rolls.some(row => row.child_id === childId && row.kind === "gamble" && row.risked_item_id === itemId)) throw new Error("already-tried");
      // Only on an item just unlocked: its unlock level must be the child's highest level right now.
      const bestLevel = fakeBestLevel(childId);
      if (item.unlockLevel !== bestLevel) throw new Error("not-new");
      let outcome = pickByChance(takeAChanceOutcomes(fakeActivePowers(childId).daring || 0).map(entry => ({ item: entry, chance: entry.chance })), prototypeSettings.forcedOutcomeRandom ?? Math.random()).item;
      const prizes = outcome.id === "rarer" ? rarerPrizesFor(item, isOwned) : outcome.id === "common" ? commonSwapsFor(item, isOwned) : [];
      let won = null;
      if (outcome.id !== "keep" && prizes.length) won = pickByChance(chancesFor(prizes, null), prototypeSettings.forcedRandom ?? Math.random());
      const outcomeId = won ? outcome.id : "keep", chance = won ? outcome.chance * won.chance : 1 / 3;
      fakeDatabase.chance_rolls.push({ child_id: childId, kind: "gamble", risked_item_id: itemId, outcome: outcomeId, won_item_id: won ? won.item.id : null, chance, xp_paid: 0, rolled_on: getTodayInUk(), won_at_level: won ? fakeBestLevel(childId) : null });
      if (outcomeId !== "keep") profile.equipped_items = profile.equipped_items.filter(equippedId => equippedId !== itemId);
      return { outcome: outcomeId, wonItemId: won ? won.item.id : null, chance, profile: profileForApp(childId) };
    });
  },
  async loadChoresDoneToday() {
    return fakeRequest(false, () => {
      const childId = requireChildUserId(), today = getTodayInUk();
      return fakeDatabase.chore_completions.filter(row => row.child_id === childId && row.completed_on === today).map(row => row.chore_id);
    });
  },
  async markChoreDone(choreId) {
    return fakeRequest(true, () => {
      const childId = requireChildUserId(), today = getTodayInUk();
      if (!fakeDatabase.chore_completions.some(row => row.child_id === childId && row.chore_id === choreId && row.completed_on === today))
        fakeDatabase.chore_completions.push({ child_id: childId, buddy_id: fakeDatabase.profiles[childId].active_buddy_id, chore_id: choreId, completed_on: today });
      fakeRecordHighestLevel(childId);
    });
  },
  async unmarkChoreDone(choreId) {
    return fakeRequest(true, () => {
      const childId = requireChildUserId(), today = getTodayInUk();
      fakeDatabase.chore_completions = fakeDatabase.chore_completions.filter(row => !(row.child_id === childId && row.chore_id === choreId && row.completed_on === today));
    });
  },
  /** choiceIndex is null if the timer ran out, and for a Feel good mission, which is only saved when they tap "I did it!"
      (didIt: true; it earns its difficulty in XP, with no powers). The SERVER works out the XP (with Brain boost) and checks
      the mission suits the child's age and the daily limits (missions, plus Bonus mission; hints and think-agains against
      their powers). xp_awarded is stored so XP history doesn't change if a mission is edited later.
      Returns { xpAwarded, brainBoost }. Throws Error("daily-limit"), Error("not-for-age") or Error("no-power"). */
  async saveMissionCompletion(missionId, choiceIndex, { usedHint = false, usedThinkAgain = false, didIt = false } = {}) {
    return fakeRequest(true, () => {
      const childId = requireChildUserId(), today = getTodayInUk(), powers = fakeActivePowers(childId), profile = fakeDatabase.profiles[childId];
      const mission = MISSIONS.find(candidate => candidate.id === missionId);
      if (!mission) throw new Error("unknown-mission");
      if (!missionsForAge(ageFromBirthMonth(profile.birth_month, profile.birth_year)).includes(mission)) throw new Error("not-for-age");
      if (isChallenge(mission) && (!didIt || choiceIndex !== null || usedHint || usedThinkAgain)) throw new Error("bad-answer");
      const todaysRows = fakeDatabase.mission_completions.filter(row => row.child_id === childId && row.completed_on === today);
      const already = todaysRows.find(row => row.mission_id === missionId);
      if (already) return { xpAwarded: already.xp_awarded, brainBoost: 0, alreadySaved: true };
      if (todaysRows.length >= MAX_MISSIONS_PER_DAY + (powers["bonus-mission"] || 0)) throw new Error("daily-limit");
      if (usedHint && todaysRows.filter(row => row.used_hint).length >= (powers.hint || 0)) throw new Error("no-power");
      if (usedThinkAgain && todaysRows.filter(row => row.used_think_again).length >= (powers["think-again"] || 0)) throw new Error("no-power");
      const brainBoost = isRightAnswer(mission, choiceIndex) ? (powers["brain-boost"] || 0) : 0;
      const xpAwarded = xpForAnswer(mission, choiceIndex, brainBoost);
      fakeDatabase.mission_completions.push({ child_id: childId, mission_id: missionId, completed_on: today, choice_index: choiceIndex, xp_awarded: xpAwarded, used_hint: usedHint, used_think_again: usedThinkAgain, did_it: isChallenge(mission) });
      return { xpAwarded, brainBoost };
    });
  },
  /** { levelPoints (the playing buddy's), buddyLevelPoints:{ buddyId: points }, highestLevelReached (ever, any buddy; stored on the profile), xpEarned, xpSpentOnItems, xpSpentInShop, daysPlayedTotal, daysPlayedDates, missionsDoneToday:[{ missionId, xpAwarded }],
      missionsLastDoneOn:{ missionId: date last done BEFORE today } (for picking missions that haven't been done) }
      Level points = set tasks + own tasks + scheduled task occurrences ticked while that buddy was playing (missions don't count).
      xpEarned = total xp_awarded from missions. xpSpentOnItems = total of item_xp. xpSpentInShop = total price_paid.
      XP to spend = xpEarned - xpSpentOnItems - xpSpentInShop.
      A day counts as played if any task or mission was done. */
  async loadProgressSummary() {
    return fakeRequest(false, () => fakeProgressSummary(requireChildUserId()));
  },

  /* ---------- Parent accounts ---------- */
  /** A parent or carer signs up. { displayName, email, password }. Signs them in and returns their profile.
      Throws Error("needs-name"), Error("bad-email"), Error("too-short") or Error("email-taken"). */
  async signUpParent({ displayName, email, password }) {
    return fakeRequest(true, () => {
      const name = displayName.trim(), cleanEmail = email.trim().toLowerCase();
      if (!name || name.length > 30) throw new Error("needs-name");
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(cleanEmail)) throw new Error("bad-email");
      if (password.length < MIN_PASSCODE_LENGTH) throw new Error("too-short");
      if (fakeDatabase.users.some(user => user.email === cleanEmail)) throw new Error("email-taken");
      const parentId = `parent-${Date.now()}`;
      fakeDatabase.users.push({ id: parentId, email: cleanEmail, passcode: password });
      fakeDatabase.profiles[parentId] = { id: parentId, role: "parent", display_name: name };
      fakeDatabase.signedInUserId = parentId;
      return profileForApp(parentId);
    });
  },
  /** The parent's children: [{ id, displayName, setupComplete, level, petName, look }] (look is null until set up). */
  async loadMyChildren() {
    return fakeRequest(false, () => {
      const parentId = requireParentUserId();
      return fakeDatabase.family_links.filter(row => row.parent_id === parentId).map(row => fakeChildForParent(row.child_id));
    });
  },
  /** Everything for one child's tab: { child, settings:{ timedMissions, resetStreakOnMiss, chanceFeatures, childCanChangeSettings },
      tasks:[{ id, title, daysOfWeek, timesPerDay, setBy }], stats, login:{ username }, grownUps, birth:{ month, year } (nulls if not given) }
      (stats: see fakeChildStats). Throws Error("not-your-child"). */
  async loadChildOverview(childId) {
    return fakeRequest(false, () => {
      requireMyChild(childId);
      const profile = fakeDatabase.profiles[childId];
      const setTasks = fakeDatabase.chores.filter(row => row.child_id === childId && row.active)
        .map(row => ({ id: row.id, title: row.title, daysOfWeek: WEEK_DAYS.map(day => day.id), timesPerDay: 1, setBy: "parent" }));
      const scheduled = fakeDatabase.scheduled_tasks.filter(row => row.child_id === childId && row.active).map(fakeScheduledTaskShape);
      return {
        child: fakeChildForParent(childId),
        settings: { timedMissions: !!profile.timed_missions, resetStreakOnMiss: profile.reset_streak_on_miss !== false,
          chanceFeatures: profile.chance_features !== false, childCanChangeSettings: profile.child_can_change_settings !== false },
        tasks: [...setTasks, ...scheduled],
        stats: fakeChildStats(childId),
        login: { username: (fakeDatabase.users.find(user => user.id === childId) || {}).username || "" },
        grownUps: fakeDatabase.family_links.filter(row => row.child_id === childId).map(row => fakeDatabase.profiles[row.parent_id].display_name),
        birth: { month: profile.birth_month || null, year: profile.birth_year || null }
      };
    });
  },
  /** A grown-up changes their child's birth month and year (the child can't). Throws Error("bad-birth-month"). */
  async setChildBirthMonth(childId, { birthMonth, birthYear }) {
    return fakeRequest(true, () => {
      requireMyChild(childId);
      checkBirthMonth(birthMonth, birthYear);
      Object.assign(fakeDatabase.profiles[childId], { birth_month: birthMonth, birth_year: birthYear });
    });
  },
  /** task = { title, daysOfWeek, timesPerDay }. Same limits as addMyScheduledTask. Returns the saved task. */
  async addChildTask(childId, task) {
    return fakeRequest(true, () => { requireMyChild(childId); return fakeAddScheduledTask(childId, task, "parent"); });
  },
  /** Removes any of the child's tasks (theirs or the parent's). Points already earned are kept. */
  async removeChildTask(childId, taskId) {
    return fakeRequest(true, () => {
      requireMyChild(childId);
      const row = fakeDatabase.scheduled_tasks.find(candidate => candidate.id === taskId && candidate.child_id === childId)
        || fakeDatabase.chores.find(candidate => candidate.id === taskId && candidate.child_id === childId);
      if (row) row.active = false;
    });
  },
  /** settings = { timedMissions, resetStreakOnMiss, chanceFeatures, childCanChangeSettings }. */
  async updateChildSettings(childId, settings) {
    return fakeRequest(true, () => {
      requireMyChild(childId);
      Object.assign(fakeDatabase.profiles[childId], { timed_missions: settings.timedMissions, reset_streak_on_miss: settings.resetStreakOnMiss,
        chance_features: settings.chanceFeatures, child_can_change_settings: settings.childCanChangeSettings });
    });
  },
  /** Adds a child to this grown-up's family: { birthMonth (1–12), birthYear, username, passcode }. Returns the child (as in loadMyChildren).
      No real name is taken: display_name starts empty (the child is shown by their username) until the child makes up
      a game name at setup. The birth month and year are used only to pick missions for the child's age; timed missions
      start off for a child under TIMED_MISSIONS_FROM_AGE. The child logs in with the username and passcode, then picks their
      buddy. Throws Error("bad-birth-month") (child must be MIN_CHILD_AGE to MAX_CHILD_AGE), Error("bad-username")
      (3–20 letters, numbers or - _), Error("username-taken"), Error("too-short") or Error("limit").
      Supabase: a function with the service role creates the auth user (hidden email, see the notes at the top). */
  async addChild({ birthMonth, birthYear, username, passcode }) {
    return fakeRequest(true, () => {
      const parentId = requireParentUserId(), cleanUsername = username.trim().toLowerCase();
      const age = checkBirthMonth(birthMonth, birthYear);
      if (!/^[a-z0-9_-]{3,20}$/.test(cleanUsername)) throw new Error("bad-username");
      if (fakeDatabase.users.some(user => user.username === cleanUsername)) throw new Error("username-taken");
      if (passcode.length < MIN_PASSCODE_LENGTH) throw new Error("too-short");
      if (fakeDatabase.family_links.filter(row => row.parent_id === parentId).length >= MAX_CHILDREN_PER_GROWN_UP) throw new Error("limit");
      const childId = `child-${Date.now()}`;
      fakeDatabase.users.push({ id: childId, username: cleanUsername, passcode });
      fakeDatabase.profiles[childId] = { id: childId, role: "child", chance_features: true, display_name: "", theme_colour: "green", location: "home", active_buddy_id: null,
        birth_month: birthMonth, birth_year: birthYear,
        equipped_items: [], timed_missions: age >= TIMED_MISSIONS_FROM_AGE, reset_streak_on_miss: true, setup_complete: false };
      fakeDatabase.family_links.push({ parent_id: parentId, child_id: childId, linked_on: getTodayInUk() });
      return fakeChildForParent(childId);
    });
  },
  /** Sets a new passcode for the child (children have no email, so this is how a forgotten passcode is fixed). */
  async setChildPasscode(childId, passcode) {
    return fakeRequest(true, () => {
      requireMyChild(childId);
      if (passcode.length < MIN_PASSCODE_LENGTH) throw new Error("too-short");
      fakeDatabase.users.find(user => user.id === childId).passcode = passcode;
    });
  },
  /** A code another grown-up (e.g. the other parent) types into "+ Add a child" to share this child. Any older code
      for the child stops working. Used once, lasts LINK_CODE_HOURS. Returns { code, expiresAt }. */
  async createGrownUpInvite(childId) {
    return fakeRequest(true, () => {
      requireMyChild(childId);
      const code = Array.from({ length: 6 }, () => LINK_CODE_LETTERS[Math.floor(Math.random() * LINK_CODE_LETTERS.length)]).join("");
      const expiresAt = new Date(Date.now() + LINK_CODE_HOURS * 3600 * 1000).toISOString();
      fakeDatabase.link_codes = fakeDatabase.link_codes.filter(row => row.child_id !== childId);
      fakeDatabase.link_codes.push({ child_id: childId, code, expires_at: expiresAt });
      return { code, expiresAt };
    });
  },
  /** Deletes the child's account and everything in it (buddies, items, progress, friends). Can't be undone.
      Supabase: one database function that deletes every row for the child, then auth.admin.deleteUser. */
  async deleteChildAccount(childId) {
    return fakeRequest(true, () => {
      requireMyChild(childId);
      const childColumns = ["child_id", "from_child_id", "to_child_id", "friend_id"];
      Object.entries(fakeDatabase).forEach(([table, rows]) => {
        if (Array.isArray(rows)) fakeDatabase[table] = rows.filter(row => !(row && (row.id === childId || childColumns.some(column => row[column] === childId))));
      });
      fakeDatabase.buddies.forEach(buddy => { if (buddy.child_id === childId) delete fakeDatabase.prototypeBonusLevelPoints[buddy.id]; });
      delete fakeDatabase.profiles[childId];
      delete (fakeDatabase.prototypeBonusXp || {})[childId];
    });
  },
  /** Links a child from an invite code another grown-up made. Returns the child (as in loadMyChildren).
      Throws Error("bad-code") (wrong, used or out of date) or Error("already-linked"). */
  async linkChildWithCode(code) {
    return fakeRequest(true, () => {
      const parentId = requireParentUserId(), cleanCode = code.toUpperCase().replace(/[^A-Z0-9]/g, "");
      if (/[01OIL]/.test(cleanCode)) throw new Error("confusing-letters");
      const row = fakeDatabase.link_codes.find(candidate => candidate.code === cleanCode && candidate.expires_at > new Date().toISOString());
      if (!row || !fakeDatabase.profiles[row.child_id] || fakeDatabase.profiles[row.child_id].role !== "child") throw new Error("bad-code");
      if (fakeDatabase.family_links.some(link => link.parent_id === parentId && link.child_id === row.child_id)) throw new Error("already-linked");
      fakeDatabase.family_links.push({ parent_id: parentId, child_id: row.child_id, linked_on: getTodayInUk() });
      fakeDatabase.link_codes = fakeDatabase.link_codes.filter(candidate => candidate !== row);
      return fakeChildForParent(row.child_id);
    });
  },
  /** Stops this grown-up seeing or changing the child's account. Only when another grown-up looks after them
      (Error("last-grown-up") otherwise: delete the account instead). The child's account and progress are untouched. */
  async unlinkChild(childId) {
    return fakeRequest(true, () => {
      const parentId = requireMyChild(childId);
      if (fakeDatabase.family_links.filter(row => row.child_id === childId).length < 2) throw new Error("last-grown-up");
      fakeDatabase.family_links = fakeDatabase.family_links.filter(row => !(row.parent_id === parentId && row.child_id === childId));
      // No grown-ups left: give the child back control of their settings and tasks.
      if (!fakeDatabase.family_links.some(row => row.child_id === childId)) {
        fakeDatabase.profiles[childId].child_can_change_settings = true;
        fakeDatabase.scheduled_tasks.filter(row => row.child_id === childId && row.set_by === "parent").forEach(row => { row.set_by = "child"; });
      }
    });
  }
};
