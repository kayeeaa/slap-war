export default {
  type: "scenario",
  id: "scenario-girl-too-loud",
  kind: "What would you do?",
  ages: [11, 13],
  difficulty: 3,
  question: "Zara's answering loads in class. Someone mutters, \"Why is she so loud? Girls shouldn't be that loud.\" A few people giggle. What do you do?",
  options: [
    { text: "Giggle along so you don't stand out.", heading: "Lots of people would think that", response: "Easy to do. But every giggle tells Zara to go quiet, and her answers are good.", whyItsHard: "Next time, try:" },
    { text: "Say \"She's just answering. You could try it.\"", heading: "That takes guts", isGoodChoice: true, response: "A calm one-liner backs her up and makes the comment look as silly as it is.", whyItsHard: "It can feel risky in class. Keep it light and quiet." },
    { text: "Tell Zara after class that her answers were good.", heading: "Kind and smart", isGoodChoice: true, response: "Comments like that sting. Hearing someone's on her side helps her keep going.", whyItsHard: "It might feel awkward to bring it up. Keep it short." }
  ],
  wordsToSay: "\"She's just answering. You could try it.\""
};
