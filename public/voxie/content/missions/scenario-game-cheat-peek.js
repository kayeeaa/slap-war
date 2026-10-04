export default {
  type: "scenario",
  id: "scenario-game-cheat-peek",
  kind: "What would you do?",
  ages: [8, 10],
  difficulty: 3,
  question: "Playing hide and seek, your mate Jayden peeks through his fingers while counting. Now he wants you to do the same next round. What do you do?",
  options: [
    { text: "Say \"no peeking, that's no fun.\"", heading: "Spot on", isGoodChoice: true, response: "Games only work if everyone sticks to the rules. Otherwise nobody's really winning.", whyItsHard: "It can feel like being a spoilsport. Say it with a grin." },
    { text: "Peek too. He did it first.", heading: "Lots of people would think that", response: "Fair point that he started it. But two cheats doesn't make a fair game.", whyItsHard: "Next time, try:" },
    { text: "Stop playing with him.", heading: "Good guess", response: "You could. But saying something first gives him a chance to play fair.", whyItsHard: "Next time, try:" }
  ],
  wordsToSay: "\"Oi, no peeking! Proper count this time.\""
};
