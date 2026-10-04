export default {
  type: "scenario",
  id: "scenario-copying-homework",
  kind: "What would you do?",
  ages: [11, 13],
  difficulty: 3,
  question: "Dev says \"just copy mine, change a few words\" the night before your history homework is due. You haven't started. What do you do?",
  options: [
    { text: "Copy it. Just this once.", heading: "Lots of people would think that", response: "Teachers spot copied work more than you'd think, and you both get in trouble.", whyItsHard: "Next time, try:" },
    { text: "Do what you can, and tell your teacher you ran out of time.", heading: "Good call", isGoodChoice: true, response: "Being honest about rushing is better than being caught copying. And you'll actually learn it.", whyItsHard: "It feels like the harder option tonight. It's easier in the long run." },
    { text: "Read his to get ideas, then write your own.", heading: "Close!", response: "Getting help is fine, but it's still his ideas. Ask him to explain it instead.", whyItsHard: "Next time, try:" }
  ],
  wordsToSay: "\"Cheers, but I'll just do what I can.\""
};
