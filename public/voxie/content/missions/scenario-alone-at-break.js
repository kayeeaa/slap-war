export default {
  type: "scenario",
  id: "scenario-alone-at-break",
  kind: "What would you do?",
  ages: [8, 10],
  difficulty: 3,
  question: "At break, you notice Theo sitting on the wall on his own again. Your mates are starting a game of tag. What do you do?",
  options: [
    { text: "Ask Theo if he wants to join tag.", heading: "Kind and smart", isGoodChoice: true, response: "It takes you two seconds, and it could change his whole day.", whyItsHard: "He might say no, and that's okay. You still offered." },
    { text: "Play tag. Someone else will ask him.", heading: "Lots of people would think that", response: "Everyone thinks someone else will. That's why he's still on his own.", whyItsHard: "Next time, try:" },
    { text: "Wave at him from across the playground.", heading: "Close!", response: "Nice, but a wave doesn't get him off the wall. Going over and asking does.", whyItsHard: "Next time, try:" }
  ],
  wordsToSay: "\"We're playing tag. You in?\""
};
