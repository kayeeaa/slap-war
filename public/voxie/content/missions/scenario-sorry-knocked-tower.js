export default {
  type: "scenario",
  id: "scenario-sorry-knocked-tower",
  kind: "What would you do?",
  ages: [5, 7],
  difficulty: 3,
  question: "You knock over Theo's tower by accident. He's upset. What do you do?",
  options: [
    { text: "Say \"It was an accident!\"", heading: "Close!", response: "It was. But a sorry helps him feel better.", whyItsHard: "Next time, try:" },
    { text: "Walk away fast.", heading: "Lots of people would want to", response: "It feels easier to go. But Theo is still sad.", whyItsHard: "Next time, try:" },
    { text: "Say sorry and help rebuild.", heading: "That's a proper sorry", isGoodChoice: true, response: "A real sorry fixes things too.", whyItsHard: "Saying sorry feels wobbly. Helping makes it easier." }
  ],
  wordsToSay: "\"Sorry, Theo. Can I help you build it again?\""
};
