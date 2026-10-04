export default {
  type: "scenario",
  id: "scenario-girl-called-bossy",
  kind: "What would you do?",
  ages: [11, 13],
  difficulty: 3,
  question: "Amara is leading your group project and keeping everyone on track. Someone says, \"She's so bossy.\" Others nod. What do you do?",
  options: [
    { text: "Nod along. It's easier.", heading: "Lots of people would think that", response: "It is easier. But leading isn't bossy, and she's the reason the project's getting done.", whyItsHard: "Next time, try:" },
    { text: "Say \"She's not bossy, she's organised.\"", heading: "Spot on", isGoodChoice: true, response: "Calling it what it is turns the whole thing round, without starting a fight.", whyItsHard: "It can feel awkward to stick up for someone. Short and calm works." },
    { text: "Back her up by getting your bit done.", heading: "Kind and smart", isGoodChoice: true, response: "Pulling your weight is the best support a leader can get.", whyItsHard: "Nobody notices quiet help much. She will." }
  ],
  wordsToSay: "\"She's not bossy, she's organised. What's my bit?\""
};
