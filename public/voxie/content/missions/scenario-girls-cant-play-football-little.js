export default {
  type: "scenario",
  id: "scenario-girls-cant-play-football-little",
  kind: "What would you do?",
  ages: [5, 7],
  difficulty: 3,
  question: "Isla asks to play football. Jayden says \"Girls can't play football.\" What do you do?",
  options: [
    { text: "Say \"Yes she can!\"", heading: "Good call", isGoodChoice: true, response: "Girls play football all over the world. Football is for everyone.", whyItsHard: "It can feel scary to speak up. Short and friendly is fine." },
    { text: "Say nothing and keep playing.", heading: "Lots of people would", response: "It's easy to just play. But Isla is left out for no reason.", whyItsHard: "Next time, try:" },
    { text: "Ask a grown-up to help.", heading: "Also a good call", isGoodChoice: true, response: "A grown-up can make sure everyone gets to play.", whyItsHard: "It can feel like telling tales. It isn't. You're helping Isla play." }
  ],
  wordsToSay: "\"Girls can play. Come on, Isla, you're on our team!\""
};
