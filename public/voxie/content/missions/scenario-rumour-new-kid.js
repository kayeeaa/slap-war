export default {
  type: "scenario",
  id: "scenario-rumour-new-kid",
  kind: "What would you do?",
  ages: [8, 13],
  difficulty: 3,
  question: "Someone says the new girl, Zara, got kicked out of her old school. Nobody knows if it's true. Your friend wants to tell everyone. What do you do?",
  options: [
    { text: "Say \"we don't even know if that's true.\"", heading: "Good call", isGoodChoice: true, response: "Rumours spread fast and they're hard to take back. Stopping one is a big deal.", whyItsHard: "It can feel like spoiling the fun. Keep it chill, not preachy." },
    { text: "Pass it on, but say it might not be true.", heading: "Lots of people would think that", response: "People only remember the juicy bit, not the \"might not be true\" bit.", whyItsHard: "Next time, try:" },
    { text: "Just listen, don't say anything.", heading: "Close!", response: "Not passing it on is good. Saying something stops it going further.", whyItsHard: "Next time, try:" }
  ],
  wordsToSay: "\"We don't even know if that's true. She seems alright.\""
};
