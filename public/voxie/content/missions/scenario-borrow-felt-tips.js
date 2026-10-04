export default {
  type: "scenario",
  id: "scenario-borrow-felt-tips",
  kind: "What would you do?",
  ages: [8, 10],
  difficulty: 3,
  question: "Your felt tips have run out. Ruby's are right there on her desk and she's gone to the toilet. What do you do?",
  options: [
    { text: "Wait and ask her when she's back.", heading: "Good call", isGoodChoice: true, response: "They're hers, so she decides. Most people say yes when you ask first anyway.", whyItsHard: "Waiting is boring. Do another bit of your work while you wait." },
    { text: "Use them quickly. She won't notice.", heading: "Lots of people would think that", response: "She might notice, and then it feels like you took them. Asking takes ten seconds.", whyItsHard: "Next time, try:" },
    { text: "Ask someone else nearby if you can borrow theirs.", heading: "Also a good call", isGoodChoice: true, response: "Asking anyone first is the point. That works too.", whyItsHard: "It can feel awkward to ask. Keep it quick and say thanks." }
  ],
  wordsToSay: "\"Can I borrow your red? I'll give it straight back.\""
};
