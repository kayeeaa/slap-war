export default {
  type: "scenario",
  id: "scenario-worried-at-night",
  kind: "What would you do?",
  ages: [5, 7],
  difficulty: 3,
  question: "You feel worried about something at bedtime and can't sleep. What do you do?",
  options: [
    { text: "Tell a grown-up.", heading: "Spot on", isGoodChoice: true, response: "Worries get smaller when you share them.", whyItsHard: "It can feel silly to say. Grown-ups are good at worries." },
    { text: "Stay under the covers worrying.", heading: "Lots of people would do that", response: "Worries grow in the dark. Telling someone helps.", whyItsHard: "Next time, try:" },
    { text: "Tell your teddy.", heading: "Good guess", response: "Teddies are great for cuddles. A grown-up can help too.", whyItsHard: "Next time, try:" }
  ],
  wordsToSay: "\"I can't sleep. I'm worried about something.\""
};
