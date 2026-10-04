export default {
  type: "puzzle",
  id: "puzzle-not-prime",
  kind: "Puzzle",
  ages: [11, 13],
  difficulty: 4,
  question: "Which of these is NOT a prime number?",
  options: ["29", "53", "51"],
  correctIndex: 2,
  explanation: "51 looks prime, but 3 x 17 = 51. Quick check: its digits add to 6, which divides by 3, so 51 does too."
};
