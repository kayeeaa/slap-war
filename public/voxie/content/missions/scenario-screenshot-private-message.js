export default {
  type: "scenario",
  id: "scenario-screenshot-private-message",
  kind: "What would you do?",
  ages: [11, 13],
  difficulty: 3,
  question: "Lily messaged you privately about liking someone. Your mate Theo sees it over your shoulder and says \"screenshot it to me, it's hilarious\". What do you do?",
  options: [
    { text: "Send it. It's only Theo.", heading: "Lots of people would think that", response: "Once it's sent, it's not yours any more. Theo could send it on, and Lily trusted you with it.", whyItsHard: "Next time, try:" },
    { text: "Say no. It's Lily's business.", heading: "Spot on", isGoodChoice: true, response: "Something someone tells you privately is theirs, not yours to share. Screenshots never stay in one place.", whyItsHard: "Theo might call you boring. That passes way faster than Lily finding out." },
    { text: "Show him but don't send it.", heading: "Close!", response: "Better than sending, but it's still sharing something she told only you.", whyItsHard: "Next time, try:" }
  ],
  wordsToSay: "\"Nah, she told me that, not you.\""
};
