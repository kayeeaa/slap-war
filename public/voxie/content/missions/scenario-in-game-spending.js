export default {
  type: "scenario",
  id: "scenario-in-game-spending",
  kind: "What would you do?",
  ages: [11, 13],
  difficulty: 3,
  question: "You've got £15 birthday money. There's a new loot box in your game, and everyone's opening them. You could get something rare. What do you do?",
  options: [
    { text: "Spend it all now.", heading: "Lots of people would think that", response: "Loot boxes are designed to make you want more. You might get nothing good.", whyItsHard: "Next time, try:" },
    { text: "Wait a day and think about it.", heading: "Spot on", isGoodChoice: true, response: "Waiting helps you work out if you really want it, or just want it because everyone else has it.", whyItsHard: "Waiting feels like missing out. If you still want it tomorrow, fair enough." },
    { text: "Spend a bit and save the rest.", heading: "Good call", isGoodChoice: true, response: "Setting a limit means you can have fun without regretting it.", whyItsHard: "Stopping can be hard. Set your limit before you start." }
  ],
  wordsToSay: "\"I'll wait till tomorrow, then decide.\""
};
