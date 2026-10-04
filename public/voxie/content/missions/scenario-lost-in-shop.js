export default {
  type: "scenario",
  id: "scenario-lost-in-shop",
  kind: "What would you do?",
  ages: [5, 7],
  difficulty: 3,
  question: "You're in a big shop and you can't see your grown-up. What do you do?",
  options: [
    { text: "Go outside to look.", heading: "Lots of people would think that", response: "Stay inside. Your grown-up will be looking for you there.", whyItsHard: "Next time, try:" },
    { text: "Ask a shop worker for help.", heading: "Spot on", isGoodChoice: true, response: "Shop workers wear a badge or uniform. They can find your grown-up fast.", whyItsHard: "It's scary to talk when you're lost. Just say \"I'm lost.\"" },
    { text: "Hide and wait.", heading: "Good guess", response: "Staying put is good, but hiding makes you hard to find.", whyItsHard: "Next time, try:" }
  ],
  wordsToSay: "\"I'm lost. Can you help me find my mum?\""
};
