export default {
  type: "scenario",
  id: "scenario-man-up-hurt",
  kind: "What would you do?",
  ages: [8, 10],
  difficulty: 3,
  question: "Your mate Jayden gets kicked hard in the shin at football. His eyes are watering. Someone shouts, \"Man up, get on with it!\" What do you do?",
  options: [
    { text: "Say \"Give him a minute, that properly hurt.\"", heading: "Good call", isGoodChoice: true, response: "Hurting is hurting. Taking a minute is what proper players do.", whyItsHard: "It's hard when someone's shouting. Saying it calmly is enough." },
    { text: "Shout \"man up\" too, so the game keeps going.", heading: "Lots of people would think that", response: "Loads of people say it without thinking. But it tells him hurting is something to hide.", whyItsHard: "Next time, try:" },
    { text: "Keep playing and leave him to it.", heading: "Worth thinking about", response: "He might push through real pain and make it worse. A mate would check.", whyItsHard: "Next time, try:" }
  ],
  wordsToSay: "\"Give him a minute. That properly hurt.\""
};
