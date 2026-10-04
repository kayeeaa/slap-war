export default {
  type: "scenario",
  id: "scenario-game-where-live",
  kind: "What would you do?",
  ages: [8, 10],
  difficulty: 3,
  question: "You're building with a player in an online block-building game. They type, \"What school do you go to? Which town?\" What do you do?",
  options: [
    { text: "Don't answer, and tell a grown-up.", heading: "Spot on", isGoodChoice: true, response: "Your school and town stay private online, even with someone friendly. A grown-up can check the game settings with you.", whyItsHard: "It can feel rude not to answer. You can still keep building." },
    { text: "Just tell them the town.", heading: "Close!", response: "Better than the school. But little bits add up. Keep all of it private.", whyItsHard: "Next time, try:" },
    { text: "Tell them. You've been building together for ages.", heading: "Lots of people would think that", response: "They feel like a friend. But you can't see who's really typing.", whyItsHard: "Next time, try:" }
  ],
  wordsToSay: "\"I don't share that online. Shall we finish the tower?\""
};
