export default {
  type: "scenario",
  id: "scenario-boys-do-cry",
  kind: "What would you do?",
  ages: [5, 7],
  difficulty: 3,
  question: "Leo falls over and cries. Another kid says, \"Boys don't cry!\" What do you do?",
  options: [
    { text: "Laugh too.", heading: "Lots of people would", response: "Leo is hurt. Laughing makes him feel worse.", whyItsHard: "Next time, try:" },
    { text: "Say \"Everyone cries sometimes.\"", heading: "Spot on", isGoodChoice: true, response: "Crying is how bodies let out big feelings. Boys too. Everyone.", whyItsHard: "It's hard to answer back. A few words is plenty." },
    { text: "Help Leo up and get a grown-up.", heading: "Kind and smart", isGoodChoice: true, response: "Helping a friend who's hurt is brilliant.", whyItsHard: "You might feel shy. Helping is always okay." }
  ],
  wordsToSay: "\"Everyone cries sometimes!\""
};
