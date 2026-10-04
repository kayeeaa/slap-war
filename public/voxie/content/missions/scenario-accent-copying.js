export default {
  type: "scenario",
  id: "scenario-accent-copying",
  kind: "What would you do?",
  ages: [8, 10],
  difficulty: 3,
  question: "Mateo moved here from Spain. Some kids keep copying the way he talks and cracking up. What do you do?",
  options: [
    { text: "Ask Mateo to teach you some Spanish.", heading: "Kind and smart", isGoodChoice: true, response: "He can speak two languages. That's actually really impressive, and asking shows it.", whyItsHard: "It might feel random. Kids love teaching a few words." },
    { text: "Copy the accent too. It's just funny voices.", heading: "Lots of people would think that", response: "Funny voices can be fun. But copying someone's real voice to laugh at them isn't fun for them.", whyItsHard: "Next time, try:" },
    { text: "Say \"he speaks two languages, you speak one.\"", heading: "That takes guts", isGoodChoice: true, response: "A quick fact like that makes the copying look silly, not him.", whyItsHard: "It's easier with a grin than a frown." }
  ],
  wordsToSay: "\"He speaks two languages. How many do you speak?\""
};
