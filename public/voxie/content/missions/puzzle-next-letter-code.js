export default {
  type: "puzzle",
  id: "puzzle-next-letter-code",
  kind: "Puzzle",
  ages: [8, 10],
  difficulty: 3,
  question: "In a secret code, each letter is swapped for the next letter in the alphabet. CAT becomes DBU. What does IBU mean?",
  options: ["HUT", "BAT", "HAT"],
  correctIndex: 2,
  explanation: "Go back one letter each time: I goes to H, B goes to A, U goes to T. HAT."
};
