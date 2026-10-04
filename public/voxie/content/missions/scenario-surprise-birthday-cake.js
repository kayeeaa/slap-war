export default {
  type: "scenario",
  id: "scenario-surprise-birthday-cake",
  kind: "What would you do?",
  ages: [5, 7],
  difficulty: 3,
  question: "Dad says \"Don't tell Mum about her birthday cake. It's a surprise!\" What do you do?",
  options: [
    { text: "Tell Mum straight away.", heading: "Good guess", response: "Some things should be told. But a fun surprise can wait.", whyItsHard: "Next time, try:" },
    { text: "Keep the surprise.", heading: "Spot on", isGoodChoice: true, response: "Surprises are fun, and everyone finds out soon.", whyItsHard: "It's hard to keep exciting things in. Only till the birthday!" },
    { text: "Drop Mum a big hint.", heading: "Lots of people find it hard", response: "Hints can spoil the fun. Save it for the big day.", whyItsHard: "Next time, try:" }
  ],
  wordsToSay: "\"Shh! It's a surprise!\""
};
