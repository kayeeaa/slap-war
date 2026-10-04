/* ======================================================================
   engine/missions.js  —  picking today's missions and scoring answers. The missions themselves are in content/missions/.
   one block per mission. Each needs a permanent unique id. Never reuse or renumber ids.
   type: trivia | scenario | puzzle.
   difficulty 1–5 = the XP for getting it right. Getting it wrong (or a scenario answer
   without isGoodChoice) still earns XP_FOR_TRYING for having a go.
   Each day a child gets up to 3: a trivia, a scenario and a puzzle.
   Quiz shape:     { id, kind, difficulty, question, options:[…], correctIndex, explanation }
   Scenario shape: { id, kind, difficulty, question, options:[{text, heading, response, whyItsHard}], wordsToSay }
   ====================================================================== */
/* Each day's missions are picked from these. Adding a mission file adds it to the mix. */
const TRIVIA_MISSIONS = MISSIONS.filter(mission => mission.type === "trivia");
const SCENARIO_MISSIONS = MISSIONS.filter(mission => mission.type === "scenario");
const PUZZLE_MISSIONS = MISSIONS.filter(mission => mission.type === "puzzle");
const XP_FOR_TRYING = 1;
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
function isRightAnswer(mission, choiceIndex) {
  if (choiceIndex === TIMED_OUT) return false;
  return mission.wordsToSay ? !!mission.options[choiceIndex].isGoodChoice : choiceIndex === mission.correctIndex;
}
/* brainBoost: the Brain boost power's extra XP for a right answer. */
function xpForAnswer(mission, choiceIndex, brainBoost = 0) {
  return isRightAnswer(mission, choiceIndex) ? mission.difficulty + brainBoost : XP_FOR_TRYING;
}
/* A trivia, a scenario and a puzzle each day, plus extra missions from the Bonus mission power. */
function pickTodaysMissions(childId, bonusMissions = 0) {
  const dayNumber = Math.floor(new Date(getTodayInUk() + "T12:00:00Z").getTime() / 864e5);
  const childOffset = [...childId].reduce((total, character) => total + character.charCodeAt(0), 0);
  const pick = list => list[(dayNumber + childOffset) % list.length];
  const daily = [pick(TRIVIA_MISSIONS), pick(SCENARIO_MISSIONS), pick(PUZZLE_MISSIONS)].slice(0, MAX_MISSIONS_PER_DAY);
  const others = MISSIONS.filter(mission => !daily.includes(mission));
  const bonus = Array.from({ length: Math.min(bonusMissions, others.length) }, (_, index) => others[(dayNumber + childOffset + index * 7) % others.length])
    .filter((mission, index, list) => list.indexOf(mission) === index);
  return [...daily.sort((first, second) => first.difficulty - second.difficulty), ...bonus.map(mission => ({ ...mission, isBonus: true }))];
}
