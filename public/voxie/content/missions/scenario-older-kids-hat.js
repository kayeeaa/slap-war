export default {
  type: "scenario",
  id: "scenario-older-kids-hat",
  kind: "What would you do?",
  ages: [8, 10],
  difficulty: 3,
  question: "Some older kids keep grabbing Yusuf's hat and throwing it over his head. It happens most days. What do you do?",
  options: [
    { text: "Tell a teacher on duty.", heading: "That takes guts", isGoodChoice: true, response: "It's happening most days, so it needs a grown-up. Telling isn't snitching when someone's being picked on.", whyItsHard: "You might worry they'll know it was you. You can ask the teacher to keep it quiet." },
    { text: "Stay out of it. They're older.", heading: "Lots of people would think that", response: "Being nervous of older kids is normal. But you can still help without going near them, by telling someone.", whyItsHard: "Next time, try:" },
    { text: "Go and stand by Yusuf afterwards.", heading: "Kind and smart", isGoodChoice: true, response: "Being with him helps him feel less alone. Do this AND tell a grown-up.", whyItsHard: "It's hard to know what to say. \"You okay?\" is enough." }
  ],
  wordsToSay: "\"Miss, those Year 6s keep taking Yusuf's hat. It's every day.\""
};
