export default {
  type: "scenario",
  id: "scenario-thank-you-socks",
  kind: "What would you do?",
  ages: [5, 7],
  difficulty: 3,
  question: "Grandma gives you socks for your birthday. You wanted a toy. What do you do?",
  options: [
    { text: "Put them down and say nothing.", heading: "Lots of people would", response: "It's OK to feel a bit sad. A thank you still matters.", whyItsHard: "Next time, try:" },
    { text: "Say \"Socks? Boring.\"", heading: "Worth thinking about", response: "Grandma chose them for you. That might hurt her feelings.", whyItsHard: "Next time, try:" },
    { text: "Say thank you with a smile.", heading: "Kind and smart", isGoodChoice: true, response: "Grandma thought about you. That's the best bit.", whyItsHard: "It's hard when it's not what you wanted. A smile still says thanks." }
  ],
  wordsToSay: "\"Thanks, Grandma!\""
};
