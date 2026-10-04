export default {
  type: "scenario",
  id: "scenario-parent-card-purchase",
  kind: "What would you do?",
  ages: [8, 10],
  difficulty: 3,
  question: "Mum's card is saved on the tablet. A game offers a cool outfit for your character for £4.99. One tap and it's yours. What do you do?",
  options: [
    { text: "Ask Mum first.", heading: "Good call", isGoodChoice: true, response: "It's her money, so it's her call. And asking makes a yes more likely next time too.", whyItsHard: "Waiting is annoying. Show her the thing so she gets why you want it." },
    { text: "Tap it. It's only £4.99.", heading: "Lots of people would think that", response: "It feels small. But it's still spending someone else's money, and taps add up fast.", whyItsHard: "Next time, try:" },
    { text: "Tap it and tell her afterwards.", heading: "Good guess", response: "Telling beats hiding. But asking before is the fair way round.", whyItsHard: "Next time, try:" }
  ],
  wordsToSay: "\"Mum, can I get this outfit? It's £4.99. I can do jobs for it.\""
};
