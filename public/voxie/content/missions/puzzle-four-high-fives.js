export default {
  type: "puzzle",
  id: "puzzle-four-high-fives",
  kind: "Puzzle",
  ages: [8, 10],
  difficulty: 5,
  question: "Four friends each high-five every other friend exactly once. How many high fives happen?",
  options: ["6", "8", "12"],
  correctIndex: 0,
  explanation: "Call them A, B, C, D. A does 3 (B, C, D). B has done A, so 2 more (C, D). C just needs D: 1. 3 + 2 + 1 = 6."
};
