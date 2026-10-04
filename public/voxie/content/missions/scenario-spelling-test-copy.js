export default {
  type: "scenario",
  id: "scenario-spelling-test-copy",
  kind: "What would you do?",
  ages: [8, 10],
  difficulty: 3,
  question: "In the spelling test, you can see Isla's answers really clearly. You don't know how to spell \"necessary\". What do you do?",
  options: [
    { text: "Have your best go yourself.", heading: "Good call", isGoodChoice: true, response: "The test shows what you know, so your teacher can help with the tricky bits. Copying hides that.", whyItsHard: "Getting it wrong feels rubbish. It's one word, and now you'll learn it." },
    { text: "Have a quick look. It's just one word.", heading: "Lots of people would think that", response: "Everyone's tempted. But one word tends to become two, and it's not your score anymore.", whyItsHard: "Next time, try:" },
    { text: "Cover your eyes with your hand so you're not tempted.", heading: "Clever idea", isGoodChoice: true, response: "That's a smart trick. Out of sight, out of temptation.", whyItsHard: "It can feel silly. Nobody's watching you anyway." }
  ],
  wordsToSay: "(In your head) \"One c, two s's... I'll have a go.\""
};
