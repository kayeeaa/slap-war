export default {
  type: "scenario",
  id: "scenario-sports-day-lose",
  kind: "What would you do?",
  ages: [8, 10],
  difficulty: 3,
  question: "You trained loads for the sports day race and come fourth. Mateo, who won, comes over grinning. What do you do?",
  options: [
    { text: "Say well done, even though you're gutted.", heading: "That takes guts", isGoodChoice: true, response: "Being gutted and saying well done at the same time is properly hard. It's what good sports do.", whyItsHard: "You can still be sad later. Saying well done doesn't cancel that out." },
    { text: "Say the race wasn't fair because he started early.", heading: "Lots of people would think that", response: "Sometimes that's true, but saying it right after losing usually just sounds like sore losing.", whyItsHard: "Next time, try:" },
    { text: "Walk off without saying anything.", heading: "Good guess", response: "Needing a minute is fair enough. Coming back to say well done after is even better.", whyItsHard: "Next time, try:" }
  ],
  wordsToSay: "\"Well done, you were fast. I'm getting you next year.\""
};
