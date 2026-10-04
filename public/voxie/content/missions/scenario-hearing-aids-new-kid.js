export default {
  type: "scenario",
  id: "scenario-hearing-aids-new-kid",
  kind: "What would you do?",
  ages: [8, 10],
  difficulty: 3,
  question: "A new girl, Aisha, wears hearing aids. A couple of kids are whispering and pointing at her ears. What do you do?",
  options: [
    { text: "Say hi and ask if she wants to sit with you.", heading: "Kind and smart", isGoodChoice: true, response: "Being new is hard enough. A friendly face makes the hearing aids no big deal.", whyItsHard: "Talking to a new person feels awkward. \"Hi, I'm...\" is all you need." },
    { text: "Ask the whisperers what's so funny.", heading: "That takes guts", isGoodChoice: true, response: "It makes them think about what they're doing, without a big telling-off.", whyItsHard: "Keep it calm and curious, not angry." },
    { text: "Have a good look. You're curious too.", heading: "Lots of people would think that", response: "Being curious is normal. Staring just makes her feel like everyone's watching.", whyItsHard: "Next time, try:" }
  ],
  wordsToSay: "\"Hi! Want to come and sit with us?\""
};
