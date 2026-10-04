export default {
  type: "scenario",
  id: "scenario-ask-before-posting",
  kind: "What would you do?",
  ages: [11, 13],
  difficulty: 3,
  question: "You took a funny photo of your mates at the park. One of them, Maisie, says she doesn't like how she looks. You think it's a great pic. What do you do?",
  options: [
    { text: "Post it anyway. It's funny.", heading: "Lots of people would think that", response: "It's her face. If she's not happy, it shouldn't go up.", whyItsHard: "Next time, try:" },
    { text: "Leave it, and ask which one she'd be happy with.", heading: "Spot on", isGoodChoice: true, response: "It's her face, so it's her call. Finding one she likes means everyone's happy.", whyItsHard: "It feels like a waste of a good pic. There'll be others." },
    { text: "Crop her out and post it.", heading: "Close!", response: "Better, but she might still feel left out. Ask first.", whyItsHard: "Next time, try:" }
  ],
  wordsToSay: "\"Fair enough. Which one can I post?\""
};
