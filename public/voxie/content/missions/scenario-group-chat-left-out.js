export default {
  type: "scenario",
  id: "scenario-group-chat-left-out",
  kind: "What would you do?",
  ages: [8, 10],
  difficulty: 3,
  question: "Your friends start a group chat to plan a park meet-up. Someone types, \"Don't add Zara, she's annoying.\" Zara's your friend too. What do you do?",
  options: [
    { text: "Type \"Zara's fun though, let's add her.\"", heading: "Kind and smart", isGoodChoice: true, response: "Seeing everyone else went and you weren't asked feels horrible. One message can stop that.", whyItsHard: "Going against the chat is hard. Keep it friendly, not a telling-off." },
    { text: "Say nothing. It's not your chat.", heading: "Lots of people would think that", response: "It's easier to stay quiet. But Zara will probably find out, and it'll hurt.", whyItsHard: "Next time, try:" },
    { text: "Message Zara privately so she knows about it.", heading: "Good guess", response: "You want to be honest with her. But that might just upset her. Try to change the plan first.", whyItsHard: "Next time, try:" }
  ],
  wordsToSay: "\"Zara's fun though. Can we add her?\""
};
