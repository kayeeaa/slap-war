export default {
  type: "scenario",
  id: "scenario-ponytail-pulling",
  kind: "What would you do?",
  ages: [8, 10],
  difficulty: 3,
  question: "Your mate Finn keeps pulling Maisie's ponytail in the lunch queue. She's told him to stop twice. He laughs, \"I'm only messing.\" What do you do?",
  options: [
    { text: "Say \"mate, she said stop.\"", heading: "Good call", isGoodChoice: true, response: "She's said it twice, so it's not messing for her. Hearing it from a friend lands better than from a teacher.", whyItsHard: "Saying something to your mate is awkward. Short and chill is easiest." },
    { text: "Laugh. Finn's just being Finn.", heading: "Lots of people would think that", response: "Lots of people let mates off. But Maisie's asked him to stop, and that's what counts.", whyItsHard: "Next time, try:" },
    { text: "Tell a dinner lady if it carries on.", heading: "Also a good call", isGoodChoice: true, response: "If a friend won't stop when asked, getting a grown-up is the right next step.", whyItsHard: "It can feel like dropping your mate in it. You're helping Maisie, not getting Finn." }
  ],
  wordsToSay: "\"Mate, she said stop. Leave it.\""
};
