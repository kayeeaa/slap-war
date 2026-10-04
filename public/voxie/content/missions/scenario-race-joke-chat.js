export default {
  type: "scenario",
  id: "scenario-race-joke-chat",
  kind: "What would you do?",
  ages: [11, 13],
  difficulty: 3,
  question: "Someone posts a \"joke\" in the class chat about Jayden's skin colour. A few people react with laughing faces. Jayden hasn't replied. What do you do?",
  options: [
    { text: "Ignore it. Not your business.", heading: "Lots of people would think that", response: "It's easy to scroll past. But silence can feel like agreement to Jayden.", whyItsHard: "Next time, try:" },
    { text: "Reply \"not funny\" and tell a teacher.", heading: "That takes guts", isGoodChoice: true, response: "Jokes about someone's race aren't banter. Saying something and telling a teacher means it gets dealt with.", whyItsHard: "It's hard to be the one who speaks up. Short and clear is enough." },
    { text: "Message Jayden to check he's ok.", heading: "Kind and smart", isGoodChoice: true, response: "He'll know he's not alone. That really matters.", whyItsHard: "It's hard to know what to say. \"You ok?\" is enough." }
  ],
  wordsToSay: "\"That's not funny.\""
};
