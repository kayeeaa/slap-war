export default {
  type: "scenario",
  id: "scenario-stranger-extra-nice",
  kind: "What would you do?",
  ages: [8, 10],
  difficulty: 3,
  question: "A player you don't know in real life keeps sending you game gifts. They say you're their best friend and want to chat somewhere private. What do you do?",
  options: [
    { text: "Tell a grown-up you trust.", heading: "Spot on", isGoodChoice: true, response: "Extra gifts plus \"let's go private\" is a pattern to always tell a grown-up about. You won't be in trouble.", whyItsHard: "You might worry about losing the gifts. Telling is still the right move." },
    { text: "Keep chatting, but only in the game.", heading: "Close!", response: "Staying in the game is safer. Telling a grown-up is the important bit.", whyItsHard: "Next time, try:" },
    { text: "Go private. They've been so kind.", heading: "Lots of people would think that", response: "They seem kind, and that's what makes it tricky. Real friends don't need it to be secret.", whyItsHard: "Next time, try:" }
  ],
  wordsToSay: "\"Dad, someone in my game keeps giving me stuff and wants to chat private.\""
};
