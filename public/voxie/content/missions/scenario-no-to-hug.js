export default {
  type: "scenario",
  id: "scenario-no-to-hug",
  kind: "What would you do?",
  ages: [11, 13],
  difficulty: 3,
  question: "Your mate's cousin always hugs you when you meet. You don't want to, but everyone says \"don't be rude\". What do you do?",
  options: [
    { text: "Hug anyway so it's not awkward.", heading: "Lots of people would think that", response: "Your body, your choice. You can say no politely.", whyItsHard: "Next time, try:" },
    { text: "Offer a high five instead.", heading: "Good call", isGoodChoice: true, response: "You're still friendly, just in a way that feels right for you.", whyItsHard: "It can feel awkward at first. Most people get it fast." },
    { text: "Step back and say \"not really a hugger\".", heading: "Spot on", isGoodChoice: true, response: "Saying no is fine. A smile makes it easy.", whyItsHard: "It feels rude, but it isn't." }
  ],
  wordsToSay: "\"Not really a hugger, high five?\""
};
