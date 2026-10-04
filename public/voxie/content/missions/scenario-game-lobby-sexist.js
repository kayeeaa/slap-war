export default {
  type: "scenario",
  id: "scenario-game-lobby-sexist",
  kind: "What would you do?",
  ages: [11, 13],
  difficulty: 3,
  question: "You're in a game lobby. A girl speaks on voice and someone instantly says \"go make me a sandwich\" and starts calling her trash. What do you do?",
  options: [
    { text: "Mute the mic and play on.", heading: "Close!", response: "Protecting your own ears is fair. But she still has to hear it all.", whyItsHard: "Next time, try:" },
    { text: "Say \"she's literally top of the leaderboard, chill\" and report him.", heading: "Good call", isGoodChoice: true, response: "Backing her up and reporting it means she's not on her own, and the game can actually act on it.", whyItsHard: "Lobbies can get loud fast. You don't have to argue. Say one thing, report, move on." },
    { text: "Say nothing. It's just how lobbies are.", heading: "Lots of people would think that", response: "It is how lots of lobbies are. That's because not enough people say anything.", whyItsHard: "Next time, try:" }
  ],
  wordsToSay: "\"Chill, she's better than you. Reported.\""
};
