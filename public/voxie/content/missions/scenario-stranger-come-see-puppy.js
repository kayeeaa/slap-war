export default {
  type: "scenario",
  id: "scenario-stranger-come-see-puppy",
  kind: "What would you do?",
  ages: [5, 7],
  difficulty: 3,
  question: "Someone you don't know says \"Come and see my puppy!\" What do you do?",
  options: [
    { text: "Say no and go to your grown-up.", heading: "Spot on", isGoodChoice: true, response: "Never go anywhere with someone without asking your grown-up.", whyItsHard: "Puppies are hard to say no to. Your grown-up comes first." },
    { text: "Go for a quick look.", heading: "Lots of people would want to", response: "Puppies are cute! But always ask your grown-up first.", whyItsHard: "Next time, try:" },
    { text: "Ask what the puppy's called.", heading: "Good guess", response: "Being friendly is nice. But go to your grown-up first.", whyItsHard: "Next time, try:" }
  ],
  wordsToSay: "\"No. I have to ask my mum.\""
};
