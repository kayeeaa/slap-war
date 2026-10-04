export default {
  type: "scenario",
  id: "scenario-added-to-chat-slagging",
  kind: "What would you do?",
  ages: [11, 13],
  difficulty: 3,
  question: "You get added to a new group chat called \"no Ruby zone\". It's people from your class moaning about Ruby and posting her photos with mean captions. What do you do?",
  options: [
    { text: "Stay in but don't say anything.", heading: "Worth thinking about", response: "Staying quiet feels neutral, but being in the chat still makes it look bigger. And you'll keep seeing stuff you don't like.", whyItsHard: "Next time, try:" },
    { text: "Leave the chat, and tell an adult if it gets worse.", heading: "Good call", isGoodChoice: true, response: "You don't owe a chat like that your membership. If it carries on or gets nastier, a teacher or parent can actually do something.", whyItsHard: "People might notice you left. That's sort of the point. You can just say you didn't want to be in it." },
    { text: "Screenshot it and send it to Ruby.", heading: "Close!", response: "You want her to know, which makes sense. But seeing it all at once could really hurt. A grown-up can deal with it better.", whyItsHard: "Next time, try:" }
  ],
  wordsToSay: "\"Not being in this one, she's done nothing to me.\""
};
