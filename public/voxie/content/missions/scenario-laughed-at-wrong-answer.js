export default {
  type: "scenario",
  id: "scenario-laughed-at-wrong-answer",
  kind: "What would you do?",
  ages: [5, 7],
  difficulty: 3,
  question: "Ollie gets a sum wrong out loud. Some kids laugh. What do you do?",
  options: [
    { text: "Laugh too.", heading: "Lots of people would", response: "Everyone gets things wrong. Laughing makes him feel small.", whyItsHard: "Next time, try:" },
    { text: "Smile at him kindly.", heading: "Kind and smart", isGoodChoice: true, response: "One kind face can stop him feeling silly.", whyItsHard: "It's hard not to join in. Think how it feels when it's you." },
    { text: "Say \"Ha, that was easy!\"", heading: "Worth thinking about", response: "It might be easy for you. It wasn't for Ollie.", whyItsHard: "Next time, try:" }
  ],
  wordsToSay: "\"Don't worry, Ollie. I get them wrong too.\""
};
