export default {
  type: "scenario",
  id: "scenario-screen-time-sleep",
  kind: "What would you do?",
  ages: [11, 13],
  difficulty: 3,
  question: "It's 1am. The group chat's still buzzing. You're tired, but you don't want to miss anything. What do you do?",
  options: [
    { text: "Stay up. You'll catch up on sleep.", heading: "Lots of people would think that", response: "Sleep is how your brain sorts out the day. Missing it makes everything harder.", whyItsHard: "Next time, try:" },
    { text: "Mute the chat and go to sleep.", heading: "Spot on", isGoodChoice: true, response: "Everyone will still be there tomorrow. And you'll feel better.", whyItsHard: "It's hard to leave. Plug your phone in across the room." },
    { text: "Say \"night\" and leave.", heading: "Good call", isGoodChoice: true, response: "Saying goodnight is normal. People get it.", whyItsHard: "It's tempting to stay. Nothing in a 1am chat is that important." }
  ],
  wordsToSay: "\"Night all, need sleep.\""
};
