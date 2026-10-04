export default {
  type: "puzzle",
  id: "puzzle-knockout-matches",
  kind: "Puzzle",
  ages: [11, 13],
  difficulty: 5,
  question: "A knockout tennis tournament has 32 players. Lose once and you're out. How many matches until there's a winner?",
  options: ["16", "32", "31"],
  correctIndex: 2,
  explanation: "Every match knocks out exactly one player. To get from 32 players to 1 winner, 31 have to be knocked out, so 31 matches."
};
