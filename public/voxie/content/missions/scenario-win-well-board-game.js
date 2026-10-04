export default {
  type: "scenario",
  id: "scenario-win-well-board-game",
  kind: "What would you do?",
  ages: [8, 10],
  difficulty: 3,
  question: "You've just beaten your little sister at a board game for the third time. She looks like she might cry. What do you do?",
  options: [
    { text: "Say \"good game\" and offer to play again.", heading: "Kind and smart", isGoodChoice: true, response: "Winning well means the other person still wants to play with you.", whyItsHard: "It's fun to celebrate. You can do a small one, just not in her face." },
    { text: "Do a victory dance. You won fair and square.", heading: "Lots of people would think that", response: "You did win fair. But a big victory dance when someone's upset feels like rubbing it in.", whyItsHard: "Next time, try:" },
    { text: "Tell her she's rubbish at this game.", heading: "Worth thinking about", response: "Even as a joke, that can stick. She's younger and still learning.", whyItsHard: "Next time, try:" }
  ],
  wordsToSay: "\"Good game. Want a rematch? I'll give you a tip.\""
};
