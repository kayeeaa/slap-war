export default {
  type: "scenario",
  id: "scenario-dangerous-dare",
  kind: "What would you do?",
  ages: [11, 13],
  difficulty: 3,
  question: "Your mates dare you to pull Yusuf's chair away just as he sits down in maths. \"It'll be hilarious.\" What do you do?",
  options: [
    { text: "Do it. It's a classic.", heading: "Lots of people would think that", response: "It looks funny on videos. In real life people hit their head or back and get properly hurt.", whyItsHard: "Next time, try:" },
    { text: "\"Nah, he'll smash his head.\"", heading: "Spot on", isGoodChoice: true, response: "A dare that could hurt someone isn't a dare, it's just hurting someone.", whyItsHard: "Saying no to a dare feels like losing. Being the one who's thinking isn't losing." },
    { text: "Pretend to, but don't actually do it.", heading: "Close!", response: "Clever escape. But if you pretend, someone else might do it for real.", whyItsHard: "Next time, try:" }
  ],
  wordsToSay: "\"Nah, he'll smash his head. Do your own dare.\""
};
