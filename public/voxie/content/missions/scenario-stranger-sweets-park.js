export default {
  type: "scenario",
  id: "scenario-stranger-sweets-park",
  kind: "What would you do?",
  ages: [5, 7],
  difficulty: 3,
  question: "At the park, a grown-up you don't know offers you sweets. What do you do?",
  options: [
    { text: "Take one, it's only a sweet.", heading: "Lots of people would want to", response: "Sweets are tempting. Only take things when your grown-up says yes.", whyItsHard: "Next time, try:" },
    { text: "Say no, but keep chatting.", heading: "Close!", response: "Saying no is great. Then go straight to your grown-up.", whyItsHard: "Next time, try:" },
    { text: "Say no and go to your grown-up.", heading: "Good call", isGoodChoice: true, response: "Your grown-up needs to know. They'll say well done.", whyItsHard: "It can feel rude to say no to a grown-up. With strangers, it's fine." }
  ],
  wordsToSay: "\"No thanks. I'm going to my mum.\""
};
