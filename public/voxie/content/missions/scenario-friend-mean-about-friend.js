export default {
  type: "scenario",
  id: "scenario-friend-mean-about-friend",
  kind: "What would you do?",
  ages: [8, 13],
  difficulty: 3,
  question: "Ava says to you, \"Maisie's so annoying, don't you think?\" Maisie is your friend too. What do you say?",
  options: [
    { text: "\"I like Maisie. What's up?\"", heading: "Spot on", isGoodChoice: true, response: "You stick up for Maisie and still give Ava a chance to say what's wrong.", whyItsHard: "It's hard when someone wants you to agree. You don't have to pick a side." },
    { text: "\"Yeah, she is a bit.\"", heading: "Lots of people would think that", response: "Easy to say to keep things smooth. But it could get back to Maisie and hurt.", whyItsHard: "Next time, try:" },
    { text: "Tell Maisie what Ava said.", heading: "Good guess", response: "You want to be honest with her. But it might start a big fall-out. Talking to Ava first is better.", whyItsHard: "Next time, try:" }
  ],
  wordsToSay: "\"I like Maisie. Has something happened?\""
};
