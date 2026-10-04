export default {
  type: "scenario",
  id: "scenario-accent-mocked",
  kind: "What would you do?",
  ages: [11, 13],
  difficulty: 3,
  question: "Ewan has just moved from Glasgow. Every time he answers a question, people copy his accent and laugh. He's started to stop answering. What do you do?",
  options: [
    { text: "Laugh a bit. Accents are funny.", heading: "Lots of people would think that", response: "Everyone has an accent. Being copied every time you speak would make anyone go quiet.", whyItsHard: "Next time, try:" },
    { text: "Talk to him at break and ask about Glasgow.", heading: "Kind and smart", isGoodChoice: true, response: "Being interested in where someone's from makes them feel welcome, not weird.", whyItsHard: "Talking to the new kid can feel awkward. A simple question is all it takes." },
    { text: "Tell the copiers to leave it.", heading: "That takes guts", isGoodChoice: true, response: "Someone has to say it. It's probably not as funny as they think.", whyItsHard: "Keep it light and short." }
  ],
  wordsToSay: "\"Is Glasgow as rainy as everyone says?\""
};
