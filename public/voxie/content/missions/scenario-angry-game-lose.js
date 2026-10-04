export default {
  type: "scenario",
  id: "scenario-angry-game-lose",
  kind: "What would you do?",
  ages: [8, 10],
  difficulty: 3,
  question: "You lose a racing game to your cousin for the fifth time. You feel like throwing the controller. What do you do?",
  options: [
    { text: "Put it down and take a break.", heading: "Good call", isGoodChoice: true, response: "Taking a break when you're boiling is what calm people do. You can come back to it.", whyItsHard: "When you're angry, your body wants to do something. Walk around the room or squeeze a cushion." },
    { text: "Throw it on the sofa. It's soft.", heading: "Lots of people would think that", response: "Normal to want to. But it can bounce, break, or hit someone, and it doesn't help you win.", whyItsHard: "Next time, try:" },
    { text: "Say your cousin cheated.", heading: "Good guess", response: "It's tempting when you're losing. But blaming them just starts an argument.", whyItsHard: "Next time, try:" }
  ],
  wordsToSay: "\"I need a break. Rematch in ten minutes?\""
};
