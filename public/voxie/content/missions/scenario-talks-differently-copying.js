export default {
  type: "scenario",
  id: "scenario-talks-differently-copying",
  kind: "What would you do?",
  ages: [5, 7],
  difficulty: 3,
  question: "Yusuf talks a bit differently. Some kids copy his voice. What do you do?",
  options: [
    { text: "Copy too, it's funny.", heading: "Lots of people would", response: "It might feel funny, but it can really hurt.", whyItsHard: "Next time, try:" },
    { text: "Just watch.", heading: "Close!", response: "Not copying is good. Playing with Yusuf is even better.", whyItsHard: "Next time, try:" },
    { text: "Don't copy. Play with Yusuf.", heading: "Good call", isGoodChoice: true, response: "Everyone talks in their own way. Yusuf is just Yusuf.", whyItsHard: "It's hard to go a different way from the group. Just walk over to him." }
  ],
  wordsToSay: "\"Come on, Yusuf, let's play.\""
};
