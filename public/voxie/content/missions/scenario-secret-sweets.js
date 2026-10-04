export default {
  type: "scenario",
  id: "scenario-secret-sweets",
  kind: "What would you do?",
  ages: [8, 10],
  difficulty: 3,
  question: "An older teenager at the park gives you some sweets and says \"don't tell your mum, it's our secret.\" What do you do?",
  options: [
    { text: "Tell your mum or another grown-up you trust.", heading: "Spot on", isGoodChoice: true, response: "Surprises are fun and get shared soon. Secrets that someone says to keep from your parents are the kind to tell.", whyItsHard: "It might feel like breaking a promise. This is one promise you're allowed to break." },
    { text: "Keep it secret. They were being nice.", heading: "Lots of people would think that", response: "They might just be nice. But \"don't tell your mum\" is a sign to tell your mum.", whyItsHard: "Next time, try:" },
    { text: "Give the sweets back and don't mention it.", heading: "Close!", response: "Giving them back is smart. Telling a grown-up as well is even better.", whyItsHard: "Next time, try:" }
  ],
  wordsToSay: "\"Mum, someone at the park gave me sweets and said not to tell you.\""
};
