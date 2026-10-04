export default {
  type: "scenario",
  id: "scenario-boy-cried-after-match",
  kind: "What would you do?",
  ages: [11, 13],
  difficulty: 3,
  question: "Your team lost the final. Rhys cried in the changing room. Now someone's calling him a baby. What do you do?",
  options: [
    { text: "Laugh. It's the changing room.", heading: "Lots of people would think that", response: "Lots of top footballers cry after big games. It just means he cared.", whyItsHard: "Next time, try:" },
    { text: "\"Leave him, we all wanted to win.\"", heading: "Good call", isGoodChoice: true, response: "Crying is just a feeling coming out. Backing a mate up is what a team does.", whyItsHard: "Speaking up in front of the whole team can feel risky. Say it calm and keep it short." },
    { text: "Pat him on the back after.", heading: "Kind and smart", isGoodChoice: true, response: "Small things like that show you've got his back.", whyItsHard: "It might feel awkward. It isn't for him." }
  ],
  wordsToSay: "\"Leave him, we all wanted to win.\""
};
