export default {
  type: "puzzle",
  id: "puzzle-missing-number",
  kind: "Puzzle",
  ages: [10, 13],
  difficulty: 5,
  question: "What's the missing number? 3, 6, 12, 24, __, 96",
  options: ["36", "48", "72"],
  correctIndex: 1,
  explanation: "Each number doubles: 24 × 2 = 48, and 48 × 2 = 96."
};
