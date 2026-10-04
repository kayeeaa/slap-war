export default {
  type: "scenario",
  id: "scenario-group-chat-pile-on",
  kind: "What would you do?",
  ages: [11, 13],
  difficulty: 3,
  question: "Nia sent a voice note to the class chat and her voice cracked. Now it's 40 messages of crying-laughing emojis and people copying it. What do you do?",
  options: [
    { text: "Send her a private message instead.", heading: "Kind and smart", isGoodChoice: true, response: "You can't stop 40 people, but you can make sure she knows not everyone's laughing. That can matter more than you'd think.", whyItsHard: "It feels small. It isn't. One message can be the thing she remembers." },
    { text: "Add one laughing emoji so you don't look weird.", heading: "Lots of people would think that", response: "Everyone thinks their one emoji doesn't count. But that's exactly how 40 messages happen.", whyItsHard: "Next time, try:" },
    { text: "Post \"ok that's enough now\" in the chat.", heading: "That takes guts", isGoodChoice: true, response: "Someone has to go first. Once one person says it, others often quietly stop.", whyItsHard: "It's scary to be the one who breaks the mood. Keep it short and don't lecture." }
  ],
  wordsToSay: "\"ok that's enough now lol, leave it\""
};
