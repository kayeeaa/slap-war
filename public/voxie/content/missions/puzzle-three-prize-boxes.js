export default {
  type: "puzzle",
  id: "puzzle-three-prize-boxes",
  kind: "Puzzle",
  ages: [11, 13],
  difficulty: 5,
  question: "One of three boxes has a prize. Box A says: \"The prize is in here.\" Box B says: \"The prize is not in here.\" Box C says: \"The prize is in box A.\" Only one label is true. Where's the prize?",
  options: ["Box A", "Box C", "Box B"],
  correctIndex: 1,
  explanation: "If it's in A, all three labels are true. If it's in B, none are. If it's in C, only B's label is true. So it's box C."
};
