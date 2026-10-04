export default {
  type: "scenario",
  id: "scenario-new-friend-wheelchair",
  kind: "What would you do?",
  ages: [5, 7],
  difficulty: 3,
  question: "Aisha is new and uses a wheelchair. Everyone's going off to play. What do you do?",
  options: [
    { text: "Ask what she'd like to play.", heading: "Kind and smart", isGoodChoice: true, response: "She knows what games work best for her.", whyItsHard: "It can feel shy to ask. \"Hi, want to play?\" is enough." },
    { text: "Stare at her chair.", heading: "Lots of people would", response: "Being curious is OK. Saying hi is better than staring.", whyItsHard: "Next time, try:" },
    { text: "Leave her out.", heading: "Worth thinking about", response: "She might love to play. Just ask.", whyItsHard: "Next time, try:" }
  ],
  wordsToSay: "\"Hi Aisha! Want to play with us?\""
};
