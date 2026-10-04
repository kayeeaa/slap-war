export default {
  type: "scenario",
  id: "scenario-worried-secret-tell",
  kind: "What would you do?",
  ages: [5, 7],
  difficulty: 3,
  question: "A big kid says \"Keep this secret. Don't tell your mum.\" It makes you feel worried. What do you do?",
  options: [
    { text: "Keep the secret.", heading: "Lots of people would think that", response: "Fun surprises can be kept. Worried secrets should be told.", whyItsHard: "Next time, try:" },
    { text: "Tell a grown-up you trust.", heading: "That takes guts", isGoodChoice: true, response: "Secrets that make you worried are always OK to tell. You won't be in trouble.", whyItsHard: "It can feel like breaking a promise. Worried secrets always get told." },
    { text: "Try to forget about it.", heading: "Close!", response: "Worries don't go away by themselves. Telling helps.", whyItsHard: "Next time, try:" }
  ],
  wordsToSay: "\"Can I tell you something? It's a worried secret.\""
};
