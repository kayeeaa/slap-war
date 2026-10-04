export default {
  type: "scenario",
  id: "scenario-picking-teams",
  kind: "What would you do?",
  ages: [8, 10],
  difficulty: 3,
  question: "You're a captain picking football teams. Harrison is always picked last and he's staring at the ground. Your mates are shouting names at you. What do you do?",
  options: [
    { text: "Pick Harrison early.", heading: "That takes guts", isGoodChoice: true, response: "Being picked last every time feels rubbish. One early pick can make someone's week.", whyItsHard: "Your mates might moan. Say it like it's no big deal." },
    { text: "Pick the best players first. It's only fair.", heading: "Lots of people would think that", response: "Winning matters to you, that's normal. But it's a break-time game, not the World Cup.", whyItsHard: "Next time, try:" },
    { text: "Suggest picking teams a different way, like counting off.", heading: "Clever idea", isGoodChoice: true, response: "Counting off 1-2-1-2 means nobody gets picked last. Everyone wins that bit.", whyItsHard: "Changing how things are done can feel bossy. Just suggest it, don't push." }
  ],
  wordsToSay: "\"Harrison, you're with me.\""
};
