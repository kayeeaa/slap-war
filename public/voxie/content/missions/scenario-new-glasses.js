export default {
  type: "scenario",
  id: "scenario-new-glasses",
  kind: "What would you do?",
  ages: [5, 7],
  difficulty: 3,
  question: "Harrison comes to school in new glasses. Someone shouts \"Four eyes!\" What do you do?",
  options: [
    { text: "Say \"Cool glasses!\"", heading: "Spot on", isGoodChoice: true, response: "One kind word can beat a mean one.", whyItsHard: "It's hard to speak up. Two words is all it takes." },
    { text: "Laugh along.", heading: "Lots of people would", response: "It might feel like a joke, but Harrison probably feels sad.", whyItsHard: "Next time, try:" },
    { text: "Say nothing.", heading: "Good guess", response: "That's OK, but a kind word could really help him.", whyItsHard: "Next time, try:" }
  ],
  wordsToSay: "\"Cool glasses, Harrison!\""
};
