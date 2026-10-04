export default {
  type: "puzzle",
  id: "puzzle-coin-five-heads",
  kind: "Puzzle",
  ages: [11, 13],
  difficulty: 3,
  question: "A fair coin has landed heads five times in a row. What's the chance the next flip is heads?",
  options: ["Less than half", "Exactly half", "More than half"],
  correctIndex: 1,
  explanation: "The coin has no memory. Every flip is a fresh 50:50, whatever happened before."
};
