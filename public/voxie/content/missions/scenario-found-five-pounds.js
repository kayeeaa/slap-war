export default {
  type: "scenario",
  id: "scenario-found-five-pounds",
  kind: "What would you do?",
  ages: [8, 10],
  difficulty: 3,
  question: "You find a £5 note on the classroom floor. Nobody saw you pick it up. What do you do?",
  options: [
    { text: "Hand it to your teacher.", heading: "Good call", isGoodChoice: true, response: "Someone will be missing it. Imagine if it was your pocket money.", whyItsHard: "Five pounds is a lot. It feels good when it gets back to the right person though." },
    { text: "Keep it. Finders keepers.", heading: "Lots of people would think that", response: "Lots of people say it. But it belongs to someone, and they might be really worried.", whyItsHard: "Next time, try:" },
    { text: "Ask loudly \"has anyone lost money?\"", heading: "Close!", response: "Nice idea, but someone might say yes who didn't lose it. A teacher can check.", whyItsHard: "Next time, try:" }
  ],
  wordsToSay: "\"Miss, I found this on the floor.\""
};
