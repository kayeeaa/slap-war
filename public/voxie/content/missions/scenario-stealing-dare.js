export default {
  type: "scenario",
  id: "scenario-stealing-dare",
  kind: "What would you do?",
  ages: [11, 13],
  difficulty: 3,
  question: "At the corner shop, your mates dare you to nick a chocolate bar. \"It's 50p, they won't care.\" What do you do?",
  options: [
    { text: "Do it. It's only 50p.", heading: "Lots of people would think that", response: "It's not about the price. Shops can ban you or call the police, and it's still stealing.", whyItsHard: "Next time, try:" },
    { text: "\"Nah\" and buy one yourself.", heading: "Spot on", isGoodChoice: true, response: "You get the chocolate, and you don't get in trouble. Easy win.", whyItsHard: "Dares are hard to turn down in front of people. Make a joke of it." },
    { text: "Wait outside so you're not involved.", heading: "Good guess", response: "Keeps you out of it, but your mates might still do it. Try saying something.", whyItsHard: "Next time, try:" }
  ],
  wordsToSay: "\"Nah, I'll just buy one, I'm not getting banned for 50p.\""
};
