export default {
  type: "scenario",
  id: "scenario-friend-sad-bench",
  kind: "What would you do?",
  ages: [5, 7],
  difficulty: 3,
  question: "Priya is sitting on the bench crying at break. What do you do?",
  options: [
    { text: "Sit with her and ask.", heading: "Spot on", isGoodChoice: true, response: "Just being there helps someone feel less alone.", whyItsHard: "You might not know what to say. \"Are you OK?\" is enough." },
    { text: "Leave her alone.", heading: "Good guess", response: "Some people want space. But asking lets her choose.", whyItsHard: "Next time, try:" },
    { text: "Pull silly faces at her.", heading: "Close!", response: "Fun idea, but ask first. She might want to talk.", whyItsHard: "Next time, try:" }
  ],
  wordsToSay: "\"Are you OK? Want me to sit with you?\""
};
