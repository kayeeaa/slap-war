export default {
  type: "scenario",
  id: "scenario-boys-rating-girls",
  kind: "What would you do?",
  ages: [9, 10],
  difficulty: 3,
  question: "At break, some of your group start giving the girls marks out of 10 for how they look. One asks you, \"Who'd you give a 10?\" What do you say?",
  options: [
    { text: "\"Nah, that's weird. Let's play something.\"", heading: "That takes guts", isGoodChoice: true, response: "Getting a score for your looks feels horrible. Moving it on stops it without a big speech.", whyItsHard: "It's hard when it's your group. A quick \"nah\" works better than a lecture." },
    { text: "Pick someone so you don't look odd.", heading: "Lots of people would think that", response: "Wanting to fit in is totally normal. But the girls usually find out, and it can really hurt.", whyItsHard: "Next time, try:" },
    { text: "Just shrug and say nothing.", heading: "Close!", response: "Not joining in is a good start. Saying \"nah\" helps the others stop too.", whyItsHard: "Next time, try:" }
  ],
  wordsToSay: "\"Nah, that's weird. Who's up for football?\""
};
