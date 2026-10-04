export default {
  type: "scenario",
  id: "scenario-teacher-disrespected",
  kind: "What would you do?",
  ages: [11, 13],
  difficulty: 3,
  question: "There's a supply teacher in French. A group keeps calling out, pretending not to hear her and mimicking her accent. Some people are filming. What do you do?",
  options: [
    { text: "Join in. Everyone's doing it.", heading: "Lots of people would think that", response: "Supply lessons can feel like a free pass, but she's a real person trying to do her job.", whyItsHard: "Next time, try:" },
    { text: "Just get on with your work.", heading: "Good call", isGoodChoice: true, response: "Not joining in is a quiet way of showing respect. She'll notice.", whyItsHard: "It feels boring when everyone else is having a laugh." },
    { text: "Tell the regular teacher about the filming afterwards.", heading: "That takes guts", isGoodChoice: true, response: "Filming a teacher and sharing it is a big deal. Telling someone helps stop it.", whyItsHard: "It can feel like snitching. You're protecting her, not getting anyone in trouble." }
  ],
  wordsToSay: "\"Can we just do this, I actually need it for the test.\""
};
