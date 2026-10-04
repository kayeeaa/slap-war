export default {
  type: "scenario",
  id: "scenario-girls-cant-play-football",
  kind: "What would you do?",
  ages: [8, 10],
  difficulty: 3,
  question: "Priya asks to join football at break. One of the boys says, \"Girls can't play football.\" You know she's good. What do you do?",
  options: [
    { text: "Say \"She's good, she can be on my team.\"", heading: "That takes guts", isGoodChoice: true, response: "Backing her up straight away makes it way harder for anyone to argue.", whyItsHard: "Going against a mate is hard. Saying it like it's no big deal helps." },
    { text: "Say nothing. It's not your game.", heading: "Lots of people would think that", response: "Fair enough. But Priya misses out for no reason, and she's good.", whyItsHard: "Next time, try:" },
    { text: "Ask the teacher on duty to make sure everyone can play.", heading: "Also a good call", isGoodChoice: true, response: "Football at break is for everyone. A teacher can make that clear.", whyItsHard: "You might worry it looks like telling tales. It's not. It's about fair play." }
  ],
  wordsToSay: "\"She's on my team. Let's go.\""
};
