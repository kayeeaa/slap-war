export default {
  type: "scenario",
  id: "scenario-play-fight-stop",
  kind: "What would you do?",
  ages: [8, 10],
  difficulty: 3,
  question: "You and Kai are play-fighting on the sofa. He says \"stop, I'm done\" but you're winning. What do you do?",
  options: [
    { text: "Stop straight away.", heading: "Spot on", isGoodChoice: true, response: "\"Stop\" means the game's over, even if you were winning. That's what makes people trust you to play rough.", whyItsHard: "It's annoying to stop when you're on top. A quick \"good game\" makes it feel less like losing." },
    { text: "One more go, then stop.", heading: "Lots of people would think that", response: "One more go after \"stop\" is still not stopping. He's already told you his answer.", whyItsHard: "Next time, try:" },
    { text: "Tell him he's just saying it because he's losing.", heading: "Worth thinking about", response: "Maybe he is. Doesn't matter. He still gets to say stop, and so do you next time.", whyItsHard: "Next time, try:" }
  ],
  wordsToSay: "\"Okay, done. Good game.\""
};
