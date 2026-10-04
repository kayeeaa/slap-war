export default {
  type: "scenario",
  id: "scenario-maybe-show-drawing",
  kind: "What would you do?",
  ages: [8, 10],
  difficulty: 3,
  question: "You think Priya's drawing is amazing. You ask if you can show it to the whole class. She goes red and says \"maybe... I dunno.\" What now?",
  options: [
    { text: "Leave it. \"Maybe\" isn't yes.", heading: "Kind and smart", isGoodChoice: true, response: "\"Maybe\" and \"I dunno\" usually mean she's not sure. If she wants to, she can say yes later.", whyItsHard: "It's hard when you're excited for someone. You can still tell her it's brilliant." },
    { text: "Show it anyway. She'll be glad.", heading: "Good guess", response: "She might be. But she didn't say yes, and it's her drawing. Being put on the spot can feel horrible.", whyItsHard: "Next time, try:" },
    { text: "Keep asking till she says yes.", heading: "Lots of people would think that", response: "A yes you get by nagging isn't a real yes. It just means she got tired of saying no.", whyItsHard: "Next time, try:" }
  ],
  wordsToSay: "\"No worries. It's really good though.\""
};
