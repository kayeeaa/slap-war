export default {
  type: "scenario",
  id: "scenario-auntie-kiss-high-five",
  kind: "What would you do?",
  ages: [5, 7],
  difficulty: 3,
  question: "Auntie wants a big kiss goodbye. You don't feel like it today. What can you do?",
  options: [
    { text: "Kiss her anyway.", heading: "Lots of people would do that", response: "You can if you want to. But you're allowed to say no to kisses.", whyItsHard: "Next time, try:" },
    { text: "Hide behind the sofa.", heading: "Good guess", response: "Hiding is OK, but saying it kindly is easier for everyone.", whyItsHard: "Next time, try:" },
    { text: "Offer a high five instead.", heading: "Kind and smart", isGoodChoice: true, response: "You can say no to kisses and still be kind.", whyItsHard: "It can feel rude to say no. A smile and a high five keeps it friendly." }
  ],
  wordsToSay: "\"No kiss today. High five?\""
};
