export default {
  type: "scenario",
  id: "scenario-boy-likes-dance",
  kind: "What would you do?",
  ages: [11, 13],
  difficulty: 3,
  question: "Arlo's joined the dance club. Some people in your form are calling him names and asking if he's \"a girl now\". What do you do?",
  options: [
    { text: "Join in. It's a laugh.", heading: "Lots of people would think that", response: "Dancing is just a skill like football. Anyone can be into it.", whyItsHard: "Next time, try:" },
    { text: "\"Dance is hard, you couldn't do it.\"", heading: "That takes guts", isGoodChoice: true, response: "It flips it round. Dancing takes strength and guts.", whyItsHard: "Sticking up for someone can be scary. A joke can make it easier." },
    { text: "Ask Arlo what dance he's learning.", heading: "Kind and smart", isGoodChoice: true, response: "Showing interest makes him feel normal for liking it.", whyItsHard: "It can feel awkward when others are laughing. One normal question helps." }
  ],
  wordsToSay: "\"Bet you couldn't last five minutes in that club.\""
};
