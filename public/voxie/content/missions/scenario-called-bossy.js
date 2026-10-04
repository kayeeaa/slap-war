export default {
  type: "scenario",
  id: "scenario-called-bossy",
  kind: "What would you do?",
  ages: [8, 10],
  difficulty: 3,
  question: "Isla's in charge of your group's poster and keeping everyone on track. Kai rolls his eyes and says, \"She's so bossy.\" What do you do?",
  options: [
    { text: "Say \"She's keeping us on track\" and do your bit.", heading: "Good call", isGoodChoice: true, response: "Someone has to keep the group going. Backing her up gets the poster done too.", whyItsHard: "It can feel awkward to stick up for someone. Doing your bit says it for you." },
    { text: "Roll your eyes too.", heading: "Lots of people would think that", response: "Easy to do. But Isla's doing a good job, and \"bossy\" really stings.", whyItsHard: "Next time, try:" },
    { text: "Snap back, \"Well, you're lazy.\"", heading: "Good guess", response: "Tempting. But now it's an argument and the poster still isn't done.", whyItsHard: "Next time, try:" }
  ],
  wordsToSay: "\"She's keeping us on track. What's my job?\""
};
