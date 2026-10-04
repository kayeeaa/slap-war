export default {
  type: "scenario",
  id: "scenario-vape-pressure",
  kind: "What would you do?",
  ages: [11, 13],
  difficulty: 3,
  question: "After school, some older kids are vaping at the bus stop. One holds it out to you: \"Go on, it's only fruity, don't be a baby.\" What do you do?",
  options: [
    { text: "Have one go so they leave you alone.", heading: "Lots of people would think that", response: "Totally get it. But \"just once\" is how it usually starts, and vapes can be really hard to stop.", whyItsHard: "Next time, try:" },
    { text: "\"Nah, I'm good\" and keep walking.", heading: "Good call", isGoodChoice: true, response: "You don't need a reason. A calm \"nah\" usually works better than an argument.", whyItsHard: "Saying no to older kids feels scary. Say it like you couldn't care less." },
    { text: "Make an excuse like \"my mum smells everything\".", heading: "That works too", isGoodChoice: true, response: "An excuse is a totally fine way to get out of it. Whatever gets you out works.", whyItsHard: "Having a go-to line ready makes it much easier in the moment." }
  ],
  wordsToSay: "\"Nah, I'm good.\""
};
