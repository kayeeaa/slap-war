export default {
  type: "scenario",
  id: "scenario-broke-friends-toy",
  kind: "What would you do?",
  ages: [8, 10],
  difficulty: 3,
  question: "You borrowed Finn's remote-control car and accidentally snapped the aerial. He hasn't noticed yet. What do you do?",
  options: [
    { text: "Tell him and say sorry properly.", heading: "That takes guts", isGoodChoice: true, response: "A proper sorry says what you did and how you'll fix it. That's how friends keep trusting you.", whyItsHard: "Owning up is scary. Say it fast before you talk yourself out of it." },
    { text: "Give it back and say nothing.", heading: "Lots of people would think that", response: "He'll find out, and then it's broken AND you didn't tell him. That's the bit that hurts friendships.", whyItsHard: "Next time, try:" },
    { text: "Say \"sorry\" but add \"it was already a bit loose.\"", heading: "Close!", response: "Owning up is good. But adding an excuse makes the sorry sound less real.", whyItsHard: "Next time, try:" }
  ],
  wordsToSay: "\"I'm really sorry, I broke the aerial. Can I help fix it or swap you something?\""
};
