/* ======================================================================
   engine/missions.js  —  picking today's missions and scoring answers. The missions themselves are in content/missions/.
   One file per mission. Each needs a permanent unique id. Never reuse or renumber ids.
   type: trivia ("Brain teaser") | puzzle | scenario ("What would you do?") | challenge ("Feel good").
   ages: [youngest, oldest] it suits. Missions are picked by the child's AGE only (worked out each day from the birth
   month and year their grown-up gave). There's no gender targeting: every mission is for every child of the right age.
   difficulty 1–5 (1–3 for Feel good) = the XP for getting it right. Getting it wrong (or a scenario answer
   without isGoodChoice) still earns XP_FOR_TRYING for having a go. Feel good missions earn their difficulty for "I did it!".
   Quiz shape:      { id, type, kind, ages, difficulty, question, options:[…], correctIndex, explanation }
   Scenario shape:  { id, type, kind, ages, difficulty, question, options:[{text, heading, isGoodChoice, response, whyItsHard}], wordsToSay }
   Feel good shape: { id, type: "challenge", kind, ages, difficulty, question, tip (optional), doneMessage }
   Full write-up: docs/voxie/MISSIONS-README.md.
   ====================================================================== */
const XP_FOR_TRYING = 1;
const MISSION_KINDS = ["trivia", "puzzle", "scenario", "challenge"];
const isChallenge = mission => mission.type === "challenge";
/* No birth month and year saved: use the missions for ages 8–13. */
const DEFAULT_MISSION_AGES = [8, 13];
/* Age in whole years from a birth month (1–12) and year. In their birth month they count as having had their birthday. */
function ageFromBirthMonth(birthMonth, birthYear, isoDate = getTodayInUk()) {
  if (!birthMonth || !birthYear) return null;
  const [year, month] = isoDate.split("-").map(Number);
  return year - birthYear - (month < birthMonth ? 1 : 0);
}
/* Missions that suit a child of this age (null = unknown). Ages outside 5–13 get the nearest band. */
function missionsForAge(age) {
  const [youngest, oldest] = age === null ? DEFAULT_MISSION_AGES : Array(2).fill(Math.min(MISSION_MAX_AGE, Math.max(MISSION_MIN_AGE, age)));
  return MISSIONS.filter(mission => mission.ages[0] <= oldest && mission.ages[1] >= youngest);
}
/* A fixed number from a piece of text (FNV-1a), so "random" picks are the same every time for the same child and day. */
function seededNumber(text) {
  let hash = 2166136261;
  for (const character of text) { hash ^= character.codePointAt(0); hash = Math.imul(hash, 16777619); }
  return hash >>> 0;
}
/* Each child works through missions in their own shuffled order. Ordering by a hash of child + mission id means
   adding new mission files slots them in without reshuffling the rest. */
const childMissionOrder = (childId, mission) => seededNumber(`${childId}:${mission.id}`);
/* The next mission to give from a list: one never done (in the child's own order), else the one done longest ago.
   lastDoneOn: { missionId: date last completed BEFORE today }, so today's picks don't change as they're done. */
function nextMissionFrom(candidates, childId, lastDoneOn) {
  return [...candidates].sort((first, second) => {
    const firstDone = lastDoneOn[first.id] || "", secondDone = lastDoneOn[second.id] || "";
    return firstDone !== secondDone ? (firstDone < secondDone ? -1 : 1) : childMissionOrder(childId, first) - childMissionOrder(childId, second);
  })[0];
}
/* Timed missions (Config switch). The clock allows time to READ the question and answers
   (at READING_WORDS_PER_MINUTE, a comfortable pace for 10–11 year olds) plus ANSWER_SECONDS to choose,
   so longer missions get longer. TIMES_UP_LINES: one is picked at random; {pet} becomes the pet's name. */
const READING_WORDS_PER_MINUTE = 100;
const MINIMUM_READING_SECONDS = 4;
const ANSWER_SECONDS = 5;
function missionTimeLimitSeconds(mission, extraSeconds = 0) {
  const texts = [mission.question, ...mission.options.map(option => typeof option === "string" ? option : option.text)];
  const words = texts.join(" ").split(/\s+/).filter(Boolean).length;
  return Math.max(MINIMUM_READING_SECONDS, Math.ceil(words / READING_WORDS_PER_MINUTE * 60)) + ANSWER_SECONDS + extraSeconds;
}
const TIMES_UP_LINES = [
  "Too slow! The question got bored and wandered off.",
  "Time's up! The clock wins this round.",
  "Whoosh! That one zoomed straight past you.",
  "{pet} tried to answer for you but just said \"blub\".",
  "Beep beep! Out of time. Your brain was still loading.",
  "Time's up! The question has gone for a snack.",
  "Ding ding! The answer ran off to hide.",
  "Oops! You blinked and the timer didn't.",
  "Too slow, speedy! Try the next one quicker.",
  "The timer says hi. And bye. Mostly bye."
];
function pickTimesUpLine() { return TIMES_UP_LINES[Math.floor(Math.random() * TIMES_UP_LINES.length)].replace("{pet}", petName()); }
const TIMED_OUT = null; // choiceIndex saved when the clock ran out
/* Quiz and scenario answers only: Feel good missions have no right answer. */
function isRightAnswer(mission, choiceIndex) {
  if (isChallenge(mission) || choiceIndex === TIMED_OUT) return false;
  return mission.wordsToSay ? !!mission.options[choiceIndex].isGoodChoice : choiceIndex === mission.correctIndex;
}
/* brainBoost: the Brain boost power's extra XP for a right answer. A Feel good mission is only saved when they did it. */
function xpForAnswer(mission, choiceIndex, brainBoost = 0) {
  if (isChallenge(mission)) return mission.difficulty;
  return isRightAnswer(mission, choiceIndex) ? mission.difficulty + brainBoost : XP_FOR_TRYING;
}
/* Each day: MAX_MISSIONS_PER_DAY missions of different kinds, the kinds picked at random from the four (seeded by child and
   date, so a reload gives the same ones), each the child's next mission of that kind for their age. Then extra missions
   from the Bonus mission power, of any kind. lastDoneOn: { missionId: date last completed before today }. */
function pickTodaysMissions(childId, { age = null, lastDoneOn = {}, bonusMissions = 0 } = {}) {
  const today = getTodayInUk(), eligible = missionsForAge(age);
  const kinds = MISSION_KINDS.filter(kind => eligible.some(mission => mission.type === kind))
    .sort((first, second) => seededNumber(`${childId}:${today}:${first}`) - seededNumber(`${childId}:${today}:${second}`))
    .slice(0, MAX_MISSIONS_PER_DAY);
  const daily = kinds.map(kind => nextMissionFrom(eligible.filter(mission => mission.type === kind), childId, lastDoneOn));
  const bonus = [];
  for (let count = 0; count < bonusMissions; count++) {
    const next = nextMissionFrom(eligible.filter(mission => !daily.includes(mission) && !bonus.includes(mission)), childId, lastDoneOn);
    if (next) bonus.push(next);
  }
  return [...daily.sort((first, second) => first.difficulty - second.difficulty), ...bonus.map(mission => ({ ...mission, isBonus: true }))];
}
