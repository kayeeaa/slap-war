export default {
  type: "scenario",
  id: "scenario-grandad-cards-showing",
  kind: "What would you do?",
  ages: [5, 7],
  difficulty: 3,
  question: "You're playing cards with Grandad. He's holding them so you can see them all. What do you do?",
  options: [
    { text: "Have a sneaky look.", heading: "Lots of people would want to", response: "Winning feels great. But if you peeked, the win isn't really yours.", whyItsHard: "Next time, try:" },
    { text: "Tell Grandad.", heading: "Good call", isGoodChoice: true, response: "Now it's a fair game. Grandad will love that you told him.", whyItsHard: "It's hard when you really want to win. A fair win feels much better." },
    { text: "Look away and say nothing.", heading: "Close!", response: "Not peeking is good. Telling him means he can fix it.", whyItsHard: "Next time, try:" }
  ],
  wordsToSay: "\"Grandad, I can see your cards!\""
};
