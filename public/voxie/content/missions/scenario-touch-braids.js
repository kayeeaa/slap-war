export default {
  type: "scenario",
  id: "scenario-touch-braids",
  kind: "What would you do?",
  ages: [8, 10],
  difficulty: 3,
  question: "Amara comes in with new braids. Everyone crowds round and a couple of kids start touching them. You want a feel too. What do you do?",
  options: [
    { text: "Tell her they look great and keep your hands to yourself.", heading: "Spot on", isGoodChoice: true, response: "Her hair is part of her. Nobody should touch it without asking, and lots of people get tired of being asked.", whyItsHard: "It's tempting when everyone else is doing it. A compliment does the job without the touching." },
    { text: "Just have a quick touch like everyone else.", heading: "Lots of people would think that", response: "Lots of hands in your hair at once can feel like being a museum exhibit. Even a quick touch adds to it.", whyItsHard: "Next time, try:" },
    { text: "Say \"guys, give her some space.\"", heading: "That takes guts", isGoodChoice: true, response: "Pointing out what's happening helps her without her having to say it.", whyItsHard: "Saying something to a crowd is hard. Keep it light and friendly." }
  ],
  wordsToSay: "\"Your hair looks ace. Guys, give her some space.\""
};
