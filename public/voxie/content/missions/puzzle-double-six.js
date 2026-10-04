export default {
  type: "puzzle",
  id: "puzzle-double-six",
  kind: "Puzzle",
  ages: [11, 13],
  difficulty: 4,
  question: "You roll two dice. What's the chance both land on six?",
  options: ["1 in 36", "1 in 6", "1 in 12"],
  correctIndex: 0,
  explanation: "Each dice has a 1 in 6 chance. Both together: 6 x 6 = 36 possible results, and only one is double six."
};
