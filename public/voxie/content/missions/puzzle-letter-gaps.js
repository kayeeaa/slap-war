export default {
  type: "puzzle",
  id: "puzzle-letter-gaps",
  kind: "Puzzle",
  ages: [11, 13],
  difficulty: 4,
  question: "What letter comes next? A, C, F, J, O, ...",
  options: ["T", "V", "U"],
  correctIndex: 2,
  explanation: "The gaps grow: +2, +3, +4, +5. Next is +6. O is letter 15, and 15 + 6 = 21, which is U."
};
