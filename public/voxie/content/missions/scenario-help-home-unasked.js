export default {
  type: "scenario",
  id: "scenario-help-home-unasked",
  kind: "What would you do?",
  ages: [8, 10],
  difficulty: 3,
  question: "Dad gets home from work looking shattered. The table's still covered in breakfast stuff. Nobody's asked you to do anything. What do you do?",
  options: [
    { text: "Clear the table without being asked.", heading: "Kind and smart", isGoodChoice: true, response: "Doing a job nobody asked for is a proper surprise. Watch his face.", whyItsHard: "It's easier to keep playing. Stick some music on and it takes five minutes." },
    { text: "Wait in case someone asks.", heading: "Lots of people would think that", response: "Fair, you weren't asked. But he's tired, and you could make his evening easier.", whyItsHard: "Next time, try:" },
    { text: "Ask him \"what can I do to help?\"", heading: "Good call", isGoodChoice: true, response: "Asking works too. He might have a job in mind.", whyItsHard: "It might feel weird to offer. Just ask." }
  ],
  wordsToSay: "\"Dad, sit down. I'll clear the table.\""
};
