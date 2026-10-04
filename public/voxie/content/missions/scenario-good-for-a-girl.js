export default {
  type: "scenario",
  id: "scenario-good-for-a-girl",
  kind: "What would you do?",
  ages: [8, 10],
  difficulty: 3,
  question: "At football club, Zara scores a brilliant goal. A dad on the sideline says, \"Wow, good for a girl!\" What do you do?",
  options: [
    { text: "Tell Zara, \"That was just a great goal.\"", heading: "Spot on", isGoodChoice: true, response: "It was a great goal, full stop. Telling her so is the perfect answer.", whyItsHard: "You don't have to say anything to the dad. Just back Zara up." },
    { text: "Say nothing. He's a grown-up.", heading: "Lots of people would think that", response: "Totally normal. He probably meant it nicely. But Zara deserves to hear it was just a great goal.", whyItsHard: "Next time, try:" },
    { text: "Tell your coach or a grown-up it sounded a bit off.", heading: "Kind and smart", isGoodChoice: true, response: "Grown-ups can have a quiet word with other grown-ups. Small things still count.", whyItsHard: "It might seem small. It's still worth saying." }
  ],
  wordsToSay: "\"That was a great goal. Full stop.\""
};
