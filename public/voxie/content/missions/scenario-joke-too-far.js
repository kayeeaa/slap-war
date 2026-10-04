export default {
  type: "scenario",
  id: "scenario-joke-too-far",
  kind: "What would you do?",
  ages: [8, 13],
  difficulty: 3,
  question: "Everyone's laughing at a joke about Leo's packed lunch. Leo laughed at first, but now he's gone quiet and is putting it away. What do you do?",
  options: [
    { text: "Change the subject and sit by Leo.", heading: "Kind and smart", isGoodChoice: true, response: "When someone goes quiet, the joke's stopped being funny for them. Moving on helps without making a big thing of it.", whyItsHard: "It's hard to stop laughing when everyone else is. Changing the subject is an easy way out." },
    { text: "Keep laughing. He laughed too.", heading: "Lots of people would think that", response: "Lots of people laugh along so they don't look upset. Him going quiet is the clue.", whyItsHard: "Next time, try:" },
    { text: "Add another joke. It's just banter.", heading: "Worth thinking about", response: "Banter works when everyone's enjoying it. If one person isn't, it's not banter anymore.", whyItsHard: "Next time, try:" }
  ],
  wordsToSay: "\"Anyway, who's playing football after?\""
};
