export default {
  type: "scenario",
  id: "scenario-ask-before-pencil-case",
  kind: "What would you do?",
  ages: [5, 7],
  difficulty: 3,
  question: "Zara has a shiny new pencil case. You want to look inside. What do you do?",
  options: [
    { text: "Open it while she's away.", heading: "Worth thinking about", response: "It's her stuff. She might not like people opening it.", whyItsHard: "Next time, try:" },
    { text: "Ask if you can look.", heading: "Good call", isGoodChoice: true, response: "It's hers, so she gets to choose. Most people love showing off new things.", whyItsHard: "Waiting for an answer is hard. Asking first is quick." },
    { text: "Grab it for a quick look.", heading: "Lots of people would want to", response: "Grabbing can upset people. Asking is just as quick.", whyItsHard: "Next time, try:" }
  ],
  wordsToSay: "\"Can I have a look at your pencil case?\""
};
