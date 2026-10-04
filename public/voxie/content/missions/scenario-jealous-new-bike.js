export default {
  type: "scenario",
  id: "scenario-jealous-new-bike",
  kind: "What would you do?",
  ages: [8, 10],
  difficulty: 3,
  question: "Nia gets a shiny new bike for her birthday. You've wanted one for ages. She's showing it off and you feel annoyed. What do you do?",
  options: [
    { text: "Say \"that's cool\" and ask to see the gears.", heading: "Kind and smart", isGoodChoice: true, response: "Feeling jealous is normal. You don't have to act on it. Being happy for her keeps the friendship good.", whyItsHard: "You can feel jealous and still be nice. Both can happen at once." },
    { text: "Say it's not even that good.", heading: "Lots of people would think that", response: "That's jealousy talking. It usually makes you both feel worse.", whyItsHard: "Next time, try:" },
    { text: "Tell a grown-up how you feel later.", heading: "Also a good call", isGoodChoice: true, response: "Talking about it helps the feeling shrink. Maybe you could save up too.", whyItsHard: "It can feel embarrassing to admit. Grown-ups get jealous too." }
  ],
  wordsToSay: "\"That's so cool. Can I see the gears?\""
};
