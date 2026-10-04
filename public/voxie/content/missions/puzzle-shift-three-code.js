export default {
  type: "puzzle",
  id: "puzzle-shift-three-code",
  kind: "Puzzle",
  ages: [11, 13],
  difficulty: 4,
  question: "In a secret code, each letter moves 3 places along the alphabet (A becomes D, Z wraps round to C). What does DPDCLQJ mean?",
  options: ["AMUSING", "AMAZING", "ALARMING"],
  correctIndex: 1,
  explanation: "Move each letter back 3: D to A, P to M, D to A, C to Z, L to I, Q to N, J to G. AMAZING."
};
