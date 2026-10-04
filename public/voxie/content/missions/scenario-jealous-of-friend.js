export default {
  type: "scenario",
  id: "scenario-jealous-of-friend",
  kind: "What would you do?",
  ages: [11, 13],
  difficulty: 3,
  question: "Your best mate Amara got picked for the school play lead. You auditioned too and didn't get anything. Everyone's congratulating her. How do you feel and what do you do?",
  options: [
    { text: "Say \"well done\" but ignore her for a week.", heading: "Lots of people would think that", response: "Jealousy is normal. But taking it out on her makes you lose a mate as well as a part.", whyItsHard: "Next time, try:" },
    { text: "Congratulate her, and let yourself feel rubbish for a bit.", heading: "Kind and smart", isGoodChoice: true, response: "You can be happy for someone and gutted for yourself at the same time. Both are fine.", whyItsHard: "It hurts. Talking to someone else about it can help." },
    { text: "Tell people she only got it because the teacher likes her.", heading: "Worth thinking about", response: "Feels good for a second. Then it's a rumour, and it hurts her.", whyItsHard: "Next time, try:" }
  ],
  wordsToSay: "\"Well done, seriously. Bit gutted for me, but buzzing for you.\""
};
