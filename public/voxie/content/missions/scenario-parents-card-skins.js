export default {
  type: "scenario",
  id: "scenario-parents-card-skins",
  kind: "What would you do?",
  ages: [11, 13],
  difficulty: 3,
  question: "Your mate says \"let's use my mum's saved card to buy skins, she won't notice.\" What do you do?",
  options: [
    { text: "Go for it. She won't notice.", heading: "Lots of people would think that", response: "She probably will. It's still stealing, even if it's family.", whyItsHard: "Next time, try:" },
    { text: "\"Nah, that's your mum's money.\"", heading: "Spot on", isGoodChoice: true, response: "It's her money. Using it without asking is still taking it, and it'll show up on her bank app.", whyItsHard: "Saying no to a mate is hard. Keep it simple." },
    { text: "Suggest you both save up instead.", heading: "Kind and smart", isGoodChoice: true, response: "You still get what you want, just without any drama.", whyItsHard: "It's slower. But no one gets in trouble." }
  ],
  wordsToSay: "\"Nah, that's your mum's money. Let's save up.\""
};
