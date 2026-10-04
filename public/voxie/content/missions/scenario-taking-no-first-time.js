export default {
  type: "scenario",
  id: "scenario-taking-no-first-time",
  kind: "What would you do?",
  ages: [11, 13],
  difficulty: 3,
  question: "Jess asked you to the cinema. You said no thanks. Now her mates keep messaging you, \"just give her a chance\". What do you do?",
  options: [
    { text: "Say yes so they stop going on.", heading: "Lots of people would think that", response: "Makes sense to want the messages to stop. But a yes you don't mean isn't fair on you or Jess.", whyItsHard: "Next time, try:" },
    { text: "Say \"still a no, but thanks\" and leave it there.", heading: "Spot on", isGoodChoice: true, response: "No is a full answer. You don't need a better reason, and you don't have to keep explaining.", whyItsHard: "It feels mean saying it twice. A clear no now is kinder than a fake yes later." },
    { text: "Make up an excuse, like you're busy.", heading: "Close!", response: "Totally normal, and it works for now. But then they'll just ask about next week.", whyItsHard: "Next time, try:" }
  ],
  wordsToSay: "\"Thanks, but it's still a no.\""
};
