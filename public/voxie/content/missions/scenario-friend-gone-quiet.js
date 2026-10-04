export default {
  type: "scenario",
  id: "scenario-friend-gone-quiet",
  kind: "What would you do?",
  ages: [11, 13],
  difficulty: 3,
  question: "Your friend Kai has gone really quiet. He's stopped gaming, leaves messages on read, and said \"what's the point\" at lunch. What do you do?",
  options: [
    { text: "Give him space. He'll talk if he wants.", heading: "Lots of people would think that", response: "Space can help, but sometimes people go quiet because they don't know how to start. A nudge can help.", whyItsHard: "Next time, try:" },
    { text: "Ask if he's ok, and tell a grown-up you trust.", heading: "Kind and smart", isGoodChoice: true, response: "Asking shows you noticed. \"What's the point\" is worth sharing with a grown-up, even if he says he's fine.", whyItsHard: "Telling a grown-up can feel like breaking his trust. It's actually looking out for him." },
    { text: "Tell him to cheer up.", heading: "Good guess", response: "You mean well, but \"cheer up\" can make someone feel like they're doing feelings wrong.", whyItsHard: "Next time, try:" }
  ],
  wordsToSay: "\"You alright? You've seemed a bit off lately. Wanna talk?\""
};
