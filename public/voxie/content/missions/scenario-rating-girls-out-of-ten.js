export default {
  type: "scenario",
  id: "scenario-rating-girls-out-of-ten",
  kind: "What would you do?",
  ages: [11, 13],
  difficulty: 3,
  question: "The group chat starts rating girls in your year out of 10. Your mates are waiting for your list. What do you do?",
  options: [
    { text: "Give everyone a 7 so nobody's upset.", heading: "Close!", response: "Nice try at being fair, but it's still rating real people like they're for sale. The girls would hate it whatever the number.", whyItsHard: "Next time, try:" },
    { text: "Say \"nah, that's weird\" and change the subject.", heading: "That takes guts", isGoodChoice: true, response: "Girls aren't scores. Plenty of the others probably feel the same and are waiting for someone to say it.", whyItsHard: "It feels like everyone's into it. Usually a few are just going along. A quick \"nah\" is enough." },
    { text: "Don't reply and hope it dies down.", heading: "Lots of people would think that", response: "Silence is easier, but it rarely stops it. Someone saying something usually does.", whyItsHard: "Next time, try:" }
  ],
  wordsToSay: "\"Nah, that's weird. Anyway, who's on tonight?\""
};
