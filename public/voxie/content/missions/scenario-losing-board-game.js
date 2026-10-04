export default {
  type: "scenario",
  id: "scenario-losing-board-game",
  kind: "What would you do?",
  ages: [5, 7],
  difficulty: 3,
  question: "You lose a board game to Dad. You feel really cross. What do you do?",
  options: [
    { text: "Throw the pieces.", heading: "Lots of people feel like that", response: "Feeling cross is OK. Throwing things isn't.", whyItsHard: "Next time, try:" },
    { text: "Say \"Good game\" and play again.", heading: "Good call", isGoodChoice: true, response: "Losing is part of games. Next time might be yours.", whyItsHard: "Losing feels rubbish. A deep breath helps before you say it." },
    { text: "Say \"This game is stupid.\"", heading: "Worth thinking about", response: "It's not really the game. Losing just feels rubbish.", whyItsHard: "Next time, try:" }
  ],
  wordsToSay: "\"Good game. Again?\""
};
