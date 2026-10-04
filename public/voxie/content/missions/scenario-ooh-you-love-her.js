export default {
  type: "scenario",
  id: "scenario-ooh-you-love-her",
  kind: "What would you do?",
  ages: [8, 10],
  difficulty: 3,
  question: "Theo and Isla are good mates and always build dens together. Some kids start chanting, \"Ooh, Theo loves Isla!\" Theo looks embarrassed. What do you do?",
  options: [
    { text: "Say \"They're just mates. Leave it.\"", heading: "Spot on", isGoodChoice: true, response: "Boys and girls can just be friends. Calling it out helps the chanting stop.", whyItsHard: "The chanting is loud. A bored, short reply works best." },
    { text: "Join in the chanting. It's funny.", heading: "Lots of people would think that", response: "It feels like a joke. But it could stop Theo and Isla being friends.", whyItsHard: "Next time, try:" },
    { text: "Ask if you can build the den with them.", heading: "Kind and smart", isGoodChoice: true, response: "Joining in shows the den is just a den, and the chanting gets boring fast.", whyItsHard: "You might get chanted at too. It stops when nobody reacts." }
  ],
  wordsToSay: "\"They're just mates. Leave it.\""
};
