export default {
  type: "scenario",
  id: "scenario-rumour-about-girl",
  kind: "What would you do?",
  ages: [11, 13],
  difficulty: 3,
  question: "There's a rumour that Zara messaged Jayden saying she fancies him, and he showed everyone. Nobody's seen the message. People keep asking you if it's true. What do you say?",
  options: [
    { text: "\"Dunno, probably.\"", heading: "Worth thinking about", response: "Even a shrug keeps a rumour alive. And nobody's actually seen the message.", whyItsHard: "Next time, try:" },
    { text: "\"Has anyone actually seen it? Just leave her alone.\"", heading: "Spot on", isGoodChoice: true, response: "Asking for proof often makes a rumour fall apart. And it's her business either way.", whyItsHard: "It's easier to go along with the gossip. Asking one simple question takes the fun out of it." },
    { text: "Ask Zara if it's true.", heading: "Good guess", response: "Meaning well, but it tells her people are talking and puts her on the spot. Better to stop it spreading.", whyItsHard: "Next time, try:" }
  ],
  wordsToSay: "\"Has anyone actually seen it? Just leave her alone.\""
};
