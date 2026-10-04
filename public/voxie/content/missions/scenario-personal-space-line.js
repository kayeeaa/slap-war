export default {
  type: "scenario",
  id: "scenario-personal-space-line",
  kind: "What would you do?",
  ages: [5, 7],
  difficulty: 3,
  question: "Finn keeps standing really close to you in the line. You feel squashed. What do you do?",
  options: [
    { text: "Ask him to step back a bit.", heading: "Good call", isGoodChoice: true, response: "You're allowed to have your own space.", whyItsHard: "It can feel awkward. Say it in a friendly voice." },
    { text: "Push him away.", heading: "Worth thinking about", response: "Pushing could hurt. Words work better.", whyItsHard: "Next time, try:" },
    { text: "Say nothing and feel squashed.", heading: "Lots of people would do that", response: "You're allowed to ask for space. He might not know.", whyItsHard: "Next time, try:" }
  ],
  wordsToSay: "\"Can you give me a bit of space, please?\""
};
