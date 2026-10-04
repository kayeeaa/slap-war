export default {
  type: "scenario",
  id: "scenario-stammer-mocked",
  kind: "What would you do?",
  ages: [11, 13],
  difficulty: 3,
  question: "Leo has a stammer. In English he's reading out loud, and someone behind you is quietly copying him to make their mates laugh. What do you do?",
  options: [
    { text: "Shush them.", heading: "Good call", isGoodChoice: true, response: "A quick shush tells them it's not ok, without making a scene.", whyItsHard: "It can feel awkward. A look or a shush is enough." },
    { text: "Laugh quietly so you're not left out.", heading: "Lots of people would think that", response: "Leo can probably hear it. Imagine trying to read while people laugh.", whyItsHard: "Next time, try:" },
    { text: "Tell the teacher after class.", heading: "Spot on", isGoodChoice: true, response: "Teachers want to know, and they can deal with it without Leo being put on the spot.", whyItsHard: "It feels like telling tales. It's looking out for him." }
  ],
  wordsToSay: "\"Shh, give it a rest.\""
};
