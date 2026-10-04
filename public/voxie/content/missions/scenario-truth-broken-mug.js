export default {
  type: "scenario",
  id: "scenario-truth-broken-mug",
  kind: "What would you do?",
  ages: [5, 7],
  difficulty: 3,
  question: "You're playing ball inside and break Mum's mug. Nobody saw. What do you do?",
  options: [
    { text: "Tell Mum.", heading: "That takes guts", isGoodChoice: true, response: "Telling the truth means Mum can trust you.", whyItsHard: "It's scary to own up. Saying it quickly gets it over with." },
    { text: "Hide the bits.", heading: "Lots of people would want to", response: "Hiding makes it feel worse, and the bits can cut fingers.", whyItsHard: "Next time, try:" },
    { text: "Say the dog did it.", heading: "Worth thinking about", response: "Then the dog gets the blame. The truth is easier in the end.", whyItsHard: "Next time, try:" }
  ],
  wordsToSay: "\"Mum, I broke your mug. I'm sorry.\""
};
