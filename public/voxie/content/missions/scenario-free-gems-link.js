export default {
  type: "scenario",
  id: "scenario-free-gems-link",
  kind: "What would you do?",
  ages: [8, 13],
  difficulty: 3,
  question: "In a game chat, someone posts: \"FREE 10,000 GEMS!! Click here and log in!\" What do you do?",
  options: [
    { text: "Don't click. Show a grown-up.", heading: "Spot on", isGoodChoice: true, response: "\"Free\" stuff that wants you to log in is one of the oldest tricks for stealing accounts.", whyItsHard: "10,000 gems is tempting. If it sounds too good to be true, it is." },
    { text: "Click it, but don't log in.", heading: "Close!", response: "Better than logging in. But some dodgy links cause trouble just by opening.", whyItsHard: "Next time, try:" },
    { text: "Click it. Free gems!", heading: "Lots of people would think that", response: "Loads of people fall for it. That's why tricksters keep posting it.", whyItsHard: "Next time, try:" }
  ],
  wordsToSay: "\"Mum, is this real? It says free gems.\""
};
