export default {
  type: "scenario",
  id: "scenario-chasing-stop",
  kind: "What would you do?",
  ages: [5, 7],
  difficulty: 3,
  question: "You're chasing Leo. He shouts \"Stop, I don't want to play!\" What do you do?",
  options: [
    { text: "Chase a bit more, then stop.", heading: "Close!", response: "Stopping straight away shows Leo he can trust you.", whyItsHard: "Next time, try:" },
    { text: "Stop chasing.", heading: "Spot on", isGoodChoice: true, response: "When someone says stop, the game is over for them.", whyItsHard: "It's hard to stop when it's fun. Ask if he wants a different game." },
    { text: "Keep going, it's fun!", heading: "Lots of people would think that", response: "It's only fun if you both want to play.", whyItsHard: "Next time, try:" }
  ],
  wordsToSay: "\"OK, stopping. Want to play something else?\""
};
