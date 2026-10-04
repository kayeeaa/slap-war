export default {
  type: "scenario",
  id: "scenario-mate-messaging-girl",
  kind: "What would you do?",
  ages: [11, 13],
  difficulty: 3,
  question: "Your mate Finn keeps messaging Isla. She stopped replying three days ago. He asks you to help write something \"that'll make her answer\". What do you say?",
  options: [
    { text: "Help him write something funny.", heading: "Lots of people would think that", response: "You're trying to help a mate. But she's already given her answer by not replying.", whyItsHard: "Next time, try:" },
    { text: "\"Mate, she's not replying. That's an answer. Leave it.\"", heading: "That takes guts", isGoodChoice: true, response: "No reply is a reply. Keeping going makes someone feel like they can't get away, even if he means it nicely.", whyItsHard: "He might be gutted. Say it like a mate, not a judge." },
    { text: "Tell him to message her from a different account.", heading: "Worth thinking about", response: "That would feel pretty creepy to her. It turns \"she's not interested\" into \"she can't escape\".", whyItsHard: "Next time, try:" }
  ],
  wordsToSay: "\"Mate, no reply is a reply. Leave it.\""
};
