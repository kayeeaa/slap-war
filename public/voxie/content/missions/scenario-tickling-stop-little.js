export default {
  type: "scenario",
  id: "scenario-tickling-stop-little",
  kind: "What would you do?",
  ages: [5, 7],
  difficulty: 3,
  question: "Your big cousin is tickling you. You don't like it any more. What do you do?",
  options: [
    { text: "Say \"Stop!\" in a big voice.", heading: "Good call", isGoodChoice: true, response: "Your body is yours. Stop means stop.", whyItsHard: "It's hard to say when you're laughing. A big clear voice helps." },
    { text: "Keep laughing and wriggling.", heading: "Lots of people would do that", response: "Laughing can make them think you like it. Saying stop is clearer.", whyItsHard: "Next time, try:" },
    { text: "Run off upset.", heading: "Close!", response: "Getting away is OK. Saying stop, or telling a grown-up, helps too.", whyItsHard: "Next time, try:" }
  ],
  wordsToSay: "\"Stop, please. I don't like it.\""
};
