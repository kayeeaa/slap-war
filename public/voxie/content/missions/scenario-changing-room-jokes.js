export default {
  type: "scenario",
  id: "scenario-changing-room-jokes",
  kind: "What would you do?",
  ages: [11, 13],
  difficulty: 3,
  question: "In the changing room after PE, a couple of people start making jokes about what girls are \"good for\". Everyone's laughing. What do you do?",
  options: [
    { text: "Laugh along. It's just the changing room.", heading: "Lots of people would think that", response: "The changing room is where lots of this stuff starts. If nobody pushes back, it starts to sound normal.", whyItsHard: "Next time, try:" },
    { text: "Say \"bit grim, mate\" and carry on getting changed.", heading: "Spot on", isGoodChoice: true, response: "You don't need a speech. A short, bored reply tells everyone it's not as funny as they think.", whyItsHard: "Being the one who doesn't laugh feels exposed. Saying it casually makes it way easier." },
    { text: "Stay quiet, then tell your mate after that it was out of order.", heading: "Good guess", response: "Better than nothing, and it's honest. But the people who needed to hear it didn't.", whyItsHard: "Next time, try:" }
  ],
  wordsToSay: "\"Bit grim, mate.\""
};
