export default {
  type: "scenario",
  id: "scenario-swing-turn",
  kind: "What would you do?",
  ages: [5, 7],
  difficulty: 3,
  question: "At the park, Kai has been on the swing for ages. You really want a go. What do you do?",
  options: [
    { text: "Ask for a turn nicely.", heading: "Good call", isGoodChoice: true, response: "Asking is the quickest way to get a go.", whyItsHard: "Waiting is hard. Asking kindly makes the wait shorter." },
    { text: "Shout \"My turn!\"", heading: "Lots of people would do that", response: "Shouting can start a row. Asking works better.", whyItsHard: "Next time, try:" },
    { text: "Grab the swing to stop it.", heading: "Worth thinking about", response: "That could hurt Kai, and he won't feel like sharing.", whyItsHard: "Next time, try:" }
  ],
  wordsToSay: "\"Can I have a turn when you're done?\""
};
