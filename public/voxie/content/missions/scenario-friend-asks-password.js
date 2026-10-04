export default {
  type: "scenario",
  id: "scenario-friend-asks-password",
  kind: "What would you do?",
  ages: [8, 13],
  difficulty: 3,
  question: "Jayden says, \"Give me your game password and I'll level you up while you're at your nan's.\" He's your best mate. What do you do?",
  options: [
    { text: "Say no thanks. Passwords stay private.", heading: "Good call", isGoodChoice: true, response: "Even best mates can fall out or mess up by accident. Passwords are just for you and your grown-ups.", whyItsHard: "It feels like you don't trust him. It's a rule for everyone, not about him." },
    { text: "Give it. He's your best mate.", heading: "Lots of people would think that", response: "Makes sense. But once someone has it, they can do anything on your account.", whyItsHard: "Next time, try:" },
    { text: "Give it and change it when you're back.", heading: "Good guess", response: "Clever thinking. But loads can happen before then. Easier to keep it.", whyItsHard: "Next time, try:" }
  ],
  wordsToSay: "\"Nah, I'm not allowed to share it. Thanks though.\""
};
