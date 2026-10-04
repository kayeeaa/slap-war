export default {
  type: "scenario",
  id: "scenario-fake-fact-going-round",
  kind: "What would you do?",
  ages: [11, 13],
  difficulty: 3,
  question: "A message is flying round every chat: \"School's shut Monday because of a gas leak, it's official, send to 10 people!\" No link, no letter. What do you do?",
  options: [
    { text: "Send it on. Better safe than sorry.", heading: "Lots of people would think that", response: "Sounds sensible, but if it's fake you've just spread it to 10 more people.", whyItsHard: "Next time, try:" },
    { text: "Check the school website or ask a parent first.", heading: "Spot on", isGoodChoice: true, response: "\"Send to 10 people\" and \"it's official\" with no source are classic signs of fake news.", whyItsHard: "Everyone else is sharing it. Checking takes 30 seconds and saves you looking daft." },
    { text: "Believe it. Best news ever.", heading: "Good guess", response: "Wanting it to be true is exactly what makes fake stuff spread. Turn up Monday with your PE kit, just in case.", whyItsHard: "Next time, try:" }
  ],
  wordsToSay: "\"Where's this from? Nothing on the school site.\""
};
