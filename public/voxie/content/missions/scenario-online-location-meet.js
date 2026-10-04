export default {
  type: "scenario",
  id: "scenario-online-location-meet",
  kind: "What would you do?",
  ages: [11, 13],
  difficulty: 3,
  question: "A player you've gamed with for months says they live near you and asks what school you go to. They say you should meet up at the shops. What do you do?",
  options: [
    { text: "Tell them the school but don't meet.", heading: "Close!", response: "Your school is basically your location. Once someone has that, they can find you.", whyItsHard: "Next time, try:" },
    { text: "Say no and tell a grown-up.", heading: "Good call", isGoodChoice: true, response: "You never really know who's on the other end online. A grown-up can check things out and keep you safe.", whyItsHard: "It can feel rude. Being careful with strangers isn't rude, even nice ones." },
    { text: "Meet up but bring a mate.", heading: "Lots of people would think that", response: "A mate doesn't make it safe. Never meet someone from online without a grown-up knowing and coming along.", whyItsHard: "Next time, try:" }
  ],
  wordsToSay: "\"Nah, I don't share that stuff online.\""
};
