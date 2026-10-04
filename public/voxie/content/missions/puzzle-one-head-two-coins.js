export default {
  type: "puzzle",
  id: "puzzle-one-head-two-coins",
  kind: "Puzzle",
  ages: [11, 13],
  difficulty: 5,
  question: "You flip two coins. What's the chance you get exactly one head?",
  options: ["1 in 3", "1 in 4", "1 in 2"],
  correctIndex: 2,
  explanation: "The four results are HH, HT, TH, TT. Two of them have exactly one head, so 2 out of 4, which is 1 in 2."
};
