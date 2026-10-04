export default {
  type: "scenario",
  id: "scenario-nickname-hurts",
  kind: "What would you do?",
  ages: [8, 13],
  difficulty: 3,
  question: "Everyone calls Finn \"Beanpole\" because he's tall. He always smiles, but today you heard him tell his mum he hates it. What do you do?",
  options: [
    { text: "Call him Finn and get your mates to as well.", heading: "Spot on", isGoodChoice: true, response: "He smiles because it's easier than saying he hates it. Using his name is a simple way to help.", whyItsHard: "Your mates might not get it at first. You don't have to explain much." },
    { text: "Keep using it. He's never said anything.", heading: "Lots of people would think that", response: "Lots of people never say anything. That doesn't mean they like it.", whyItsHard: "Next time, try:" },
    { text: "Tell everyone what you heard.", heading: "Good guess", response: "You mean well, but he might feel embarrassed that people know. Just quietly changing it is kinder.", whyItsHard: "Next time, try:" }
  ],
  wordsToSay: "\"Let's just call him Finn, yeah?\""
};
