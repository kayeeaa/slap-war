export default {
  type: "scenario",
  id: "scenario-help-shopping-bags",
  kind: "What would you do?",
  ages: [5, 7],
  difficulty: 3,
  question: "Mum is carrying lots of heavy shopping bags in. You're watching telly. What do you do?",
  options: [
    { text: "Help carry a bag.", heading: "Good call", isGoodChoice: true, response: "Two of you makes it quicker, and Mum will be chuffed.", whyItsHard: "It's hard to stop your show. It'll still be there." },
    { text: "Keep watching.", heading: "Lots of people would", response: "It's easy to not notice. A bit of help goes a long way.", whyItsHard: "Next time, try:" },
    { text: "Help after your show.", heading: "Close!", response: "Nice thought, but the bags are heavy now.", whyItsHard: "Next time, try:" }
  ],
  wordsToSay: "\"Can I carry one?\""
};
