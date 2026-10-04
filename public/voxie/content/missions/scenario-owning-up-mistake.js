export default {
  type: "scenario",
  id: "scenario-owning-up-mistake",
  kind: "What would you do?",
  ages: [11, 13],
  difficulty: 3,
  question: "You borrowed Mateo's headphones and sat on them. They've snapped. He hasn't noticed yet. What do you do?",
  options: [
    { text: "Give them back and hope he thinks they broke on their own.", heading: "Lots of people would think that", response: "Tempting. But if he works it out, he'll be more annoyed about the lying than the headphones.", whyItsHard: "Next time, try:" },
    { text: "Tell him straight away and offer to sort it.", heading: "Spot on", isGoodChoice: true, response: "Owning up fast is way less awkward than getting caught. People respect it.", whyItsHard: "The first sentence is the worst. After that, it's easy." },
    { text: "Say someone knocked them out of your bag.", heading: "Worth thinking about", response: "Lies like that tend to grow. Now you have to keep remembering the story.", whyItsHard: "Next time, try:" }
  ],
  wordsToSay: "\"Mate, I'm really sorry, I sat on your headphones. I'll sort it.\""
};
