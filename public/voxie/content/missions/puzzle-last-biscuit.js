export default {
  type: "puzzle",
  id: "puzzle-last-biscuit",
  kind: "Puzzle",
  ages: [11, 13],
  difficulty: 5,
  question: "Someone ate the last biscuit. Ava says: \"Finn did it.\" Finn says: \"It wasn't me.\" Priya says: \"It wasn't me.\" Only one of them is telling the truth. Who ate it?",
  options: ["Priya", "Ava", "Finn"],
  correctIndex: 0,
  explanation: "Try each one. If Ava did it, Finn and Priya are both telling the truth. If Finn did it, Ava and Priya are. Only if Priya did it is just one person (Finn) telling the truth."
};
