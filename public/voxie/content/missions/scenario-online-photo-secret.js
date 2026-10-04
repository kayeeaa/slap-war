export default {
  type: "scenario",
  id: "scenario-online-photo-secret",
  kind: "What would you do?",
  ages: [11, 13],
  difficulty: 3,
  question: "Someone you met on a game server is really nice. They give you tips and gifts. Now they're asking for a photo of you and saying \"don't tell your parents about our chats\". What do you do?",
  options: [
    { text: "Send one. They've been so nice.", heading: "Lots of people would think that", response: "Being nice first is exactly how some people get kids to do things. Anyone who asks you to keep secrets from your parents isn't safe.", whyItsHard: "Next time, try:" },
    { text: "Say no, block them, and tell a grown-up.", heading: "Spot on", isGoodChoice: true, response: "\"Keep it secret\" is the biggest red flag there is. You haven't done anything wrong, and a grown-up can help report it.", whyItsHard: "It can feel like losing a friend. A real friend would never ask you to hide them." },
    { text: "Make an excuse and stop replying.", heading: "Good guess", response: "Getting away from them is good. But they might try again, or try someone else. Telling a grown-up stops that.", whyItsHard: "Next time, try:" }
  ],
  wordsToSay: "\"Mum, someone online wants a photo and said not to tell you.\""
};
