export default {
  type: "scenario",
  id: "scenario-filming-without-knowing",
  kind: "What would you do?",
  ages: [11, 13],
  difficulty: 3,
  question: "Harrison is singing to himself in the corridor, thinking nobody's around. Your friend gets her phone out to film it for the chat. What do you do?",
  options: [
    { text: "Film it too. It's funny.", heading: "Lots of people would think that", response: "Imagine finding a video of yourself you didn't know about all over the chat.", whyItsHard: "Next time, try:" },
    { text: "\"Don't, he doesn't know you're filming.\"", heading: "Good call", isGoodChoice: true, response: "Filming someone without asking takes away their choice. Most people would hate it.", whyItsHard: "It can feel like killing the fun. A quick word is enough." },
    { text: "Cough loudly so he notices.", heading: "Kind and smart", isGoodChoice: true, response: "Sneaky and smart. He gets to choose whether to carry on.", whyItsHard: "It can feel a bit random. A loud cough or \"alright, Harrison?\" does the job." }
  ],
  wordsToSay: "\"Don't, he doesn't even know.\""
};
