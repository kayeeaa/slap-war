export default {
  type: "scenario",
  id: "scenario-sharing-red-crayon",
  kind: "What would you do?",
  ages: [5, 7],
  difficulty: 3,
  question: "Ruby has no red crayon. You have two. What do you do?",
  options: [
    { text: "Keep both, just in case.", heading: "Lots of people would think that", response: "But you can only use one at a time.", whyItsHard: "Next time, try:" },
    { text: "Give her one.", heading: "Kind and smart", isGoodChoice: true, response: "You still have one, and Ruby can finish her picture.", whyItsHard: "Sharing your things can feel tricky. Lending is fine, you get it back." },
    { text: "Tell her to ask Miss.", heading: "Good guess", response: "Miss could help, but you can help faster.", whyItsHard: "Next time, try:" }
  ],
  wordsToSay: "\"You can borrow my red one.\""
};
