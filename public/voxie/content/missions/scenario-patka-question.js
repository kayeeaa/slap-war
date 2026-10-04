export default {
  type: "scenario",
  id: "scenario-patka-question",
  kind: "What would you do?",
  ages: [8, 10],
  difficulty: 3,
  question: "Arjun wears a patka, a head covering that's part of his religion. A kid says, \"Why have you got a tea towel on your head?\" What do you do?",
  options: [
    { text: "Say \"it's a patka, not a tea towel.\"", heading: "Spot on", isGoodChoice: true, response: "Knowing the right name and saying it kindly turns a joke into no big deal.", whyItsHard: "You don't have to be an expert. Just the name helps." },
    { text: "Laugh. The tea towel thing is a bit funny.", heading: "Lots of people would think that", response: "It gets a laugh. But it's laughing at something that means a lot to Arjun.", whyItsHard: "Next time, try:" },
    { text: "Later, ask Arjun about it if he wants to say.", heading: "Kind and smart", isGoodChoice: true, response: "Kind curiosity is very different from teasing. Let him decide how much to share.", whyItsHard: "It can feel awkward to ask. \"Is it okay if I ask about your patka?\" works." }
  ],
  wordsToSay: "\"It's a patka. Leave it out.\""
};
