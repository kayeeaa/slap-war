export default {
  type: "puzzle",
  id: "puzzle-handshakes-six",
  kind: "Puzzle",
  ages: [11, 13],
  difficulty: 4,
  question: "Six friends meet up and everyone shakes hands with everyone else once. How many handshakes is that?",
  options: ["12", "15", "30"],
  correctIndex: 1,
  explanation: "Each person shakes 5 hands: 6 x 5 = 30. But that counts every handshake twice (yours and theirs), so 30 ÷ 2 = 15."
};
