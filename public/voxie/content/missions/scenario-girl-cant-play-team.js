export default {
  type: "scenario",
  id: "scenario-girl-cant-play-team",
  kind: "What would you do?",
  ages: [11, 13],
  difficulty: 3,
  question: "Maya wants to join the lunchtime football game. A lad says, \"Girls can't play, she'll slow us down.\" You're in the game. What do you do?",
  options: [
    { text: "Say nothing. It's not your game to run.", heading: "Lots of people would think that", response: "Fair enough to feel that way. But if nobody says anything, she's left out for no reason.", whyItsHard: "Next time, try:" },
    { text: "Say \"Let her play one game and see.\"", heading: "That takes guts", isGoodChoice: true, response: "Giving her a go is fair, and she might be better than half of you.", whyItsHard: "Going against the group is hard. Keep it chill." },
    { text: "Pick her for your team.", heading: "Good call", isGoodChoice: true, response: "Actions beat arguments. Picking her says she belongs.", whyItsHard: "You might get a bit of stick. It usually stops once the game starts." }
  ],
  wordsToSay: "\"Let her have a game. She's on my team.\""
};
