export default {
  type: "scenario",
  id: "scenario-left-out-tag",
  kind: "What would you do?",
  ages: [5, 7],
  difficulty: 3,
  question: "Everyone's playing tag. Amara is standing on her own, watching. What do you do?",
  options: [
    { text: "Keep playing.", heading: "Lots of people would do that", response: "It's easy not to notice. But one question could make her whole break.", whyItsHard: "Next time, try:" },
    { text: "Wait for her to ask.", heading: "Worth thinking about", response: "Asking to join can feel scary. It's easier when someone asks you.", whyItsHard: "Next time, try:" },
    { text: "Ask her to play.", heading: "Spot on", isGoodChoice: true, response: "Now she's in the game, not stuck on the side.", whyItsHard: "It can feel shy to ask. Just say her name and wave her over." }
  ],
  wordsToSay: "\"Amara, want to play tag with us?\""
};
