export default {
  type: "puzzle",
  id: "puzzle-price-up-down",
  kind: "Puzzle",
  ages: [11, 13],
  difficulty: 5,
  question: "A game costs £50. The price goes up 10%, then a month later it drops 10%. What does it cost now?",
  options: ["£49.50", "£50", "£50.50"],
  correctIndex: 0,
  explanation: "10% of £50 is £5, so it goes up to £55. 10% of £55 is £5.50, so it drops to £49.50. The drop is bigger because it's 10% of a bigger number."
};
