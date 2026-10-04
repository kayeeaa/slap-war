export default {
  type: "scenario",
  id: "scenario-girl-game-leader",
  kind: "What would you do?",
  ages: [5, 7],
  difficulty: 3,
  question: "Mia wants to be leader of the game. Someone says, \"Girls can't be the boss.\" What do you do?",
  options: [
    { text: "Say \"Anyone can be leader.\"", heading: "That takes guts", isGoodChoice: true, response: "Girls can lead. Boys can lead. Anyone can.", whyItsHard: "It's hard to say. Short and calm works." },
    { text: "Agree so you can get playing.", heading: "Lots of people would do that", response: "It's quicker. But it isn't fair on Mia.", whyItsHard: "Next time, try:" },
    { text: "Say \"Let's take turns being leader.\"", heading: "Good call", isGoodChoice: true, response: "Taking turns is fair, and Mia gets her go.", whyItsHard: "It's a good fix when everyone wants to lead." }
  ],
  wordsToSay: "\"Anyone can be leader. Let's take turns.\""
};
