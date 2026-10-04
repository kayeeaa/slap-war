export default {
  type: "scenario",
  id: "scenario-boy-dolls-house",
  kind: "What would you do?",
  ages: [5, 7],
  difficulty: 3,
  question: "Oscar is playing with a dolls' house. Someone says, \"That's for girls!\" What do you do?",
  options: [
    { text: "Say \"Toys are for everyone\" and join in.", heading: "Good call", isGoodChoice: true, response: "Anyone can play with anything they like.", whyItsHard: "It's hard when someone says that. Joining in shows you mean it." },
    { text: "Laugh at Oscar too.", heading: "Worth thinking about", response: "That would make Oscar sad. Toys are for everyone.", whyItsHard: "Next time, try:" },
    { text: "Say nothing.", heading: "Lots of people would", response: "That's okay. But a few kind words help Oscar a lot.", whyItsHard: "Next time, try:" }
  ],
  wordsToSay: "\"Toys are for everyone. Can I play?\""
};
