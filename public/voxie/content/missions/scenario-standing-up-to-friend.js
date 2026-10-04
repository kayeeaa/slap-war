export default {
  type: "scenario",
  id: "scenario-standing-up-to-friend",
  kind: "What would you do?",
  ages: [11, 13],
  difficulty: 3,
  question: "Your best mate keeps taking a Year 7's hat on the bus and throwing it around. The kid looks close to tears. Your mate looks at you to join in. What do you do?",
  options: [
    { text: "Join in a bit so he doesn't go off at you.", heading: "Lots of people would think that", response: "It's hard to go against your best mate. But the Year 7 sees you as part of it.", whyItsHard: "Next time, try:" },
    { text: "\"Give it back, mate.\"", heading: "That takes guts", isGoodChoice: true, response: "Friends listen to each other more than anyone. You might be the only one he'd listen to.", whyItsHard: "It's hardest with a best mate. Keep it short and friendly." },
    { text: "Look away and wait.", heading: "Close!", response: "Not joining is something. But he probably wants you to say something.", whyItsHard: "Next time, try:" }
  ],
  wordsToSay: "\"Give it back, mate. Not worth it.\""
};
