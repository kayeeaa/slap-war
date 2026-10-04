export default {
  type: "scenario",
  id: "scenario-tickling-stop",
  kind: "What would you do?",
  ages: [8, 13],
  difficulty: 3,
  question: "At break, Sam keeps tickling Ava. She's laughing but keeps saying \"stop, STOP!\" What would you say?",
  options: [
    { text: "\"Mate, she said stop.\"", heading: "Good call", isGoodChoice: true, response: "Laughing can be something your body does even when you don't want it. \"Stop\" is the bit that counts.", whyItsHard: "It can feel awkward to say something to a friend. Keeping it short and chill makes it easier." },
    { text: "Nothing. She's laughing, so it's fine.", heading: "Lots of people would think that", response: "But she said stop. When someone says stop, that's the answer, even if they're laughing.", whyItsHard: "Next time, try:" },
    { text: "Join in, it's just a joke.", heading: "Worth thinking about", response: "If she's said stop, it's stopped being a joke for her. Joining in makes it harder for her to get away.", whyItsHard: "Next time, try:" }
  ],
  wordsToSay: "\"Mate, she said stop.\""
};
