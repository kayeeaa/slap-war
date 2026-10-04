export default {
  type: "scenario",
  id: "scenario-angry-block-tower",
  kind: "What would you do?",
  ages: [5, 7],
  difficulty: 3,
  question: "Your brother knocks down your block tower. You're so angry you want to hit him. What do you do?",
  options: [
    { text: "Hit him.", heading: "Lots of people feel like that", response: "Angry is OK. Hitting hurts. Breathe first.", whyItsHard: "Next time, try:" },
    { text: "Knock down his things too.", heading: "Worth thinking about", response: "Then you're both sad. It doesn't get your tower back.", whyItsHard: "Next time, try:" },
    { text: "Stomp off and take big breaths.", heading: "Good call", isGoodChoice: true, response: "Big breaths help angry feelings shrink.", whyItsHard: "Angry feelings are strong. Breathe out slowly, like blowing out candles." }
  ],
  wordsToSay: "\"I'm really cross. I need a minute.\""
};
