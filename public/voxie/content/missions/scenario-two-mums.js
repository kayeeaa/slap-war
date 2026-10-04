export default {
  type: "scenario",
  id: "scenario-two-mums",
  kind: "What would you do?",
  ages: [8, 10],
  difficulty: 3,
  question: "Ruby says her two mums are picking her up. Someone says, \"Two mums? That's weird. Where's your dad?\" A few kids giggle. What do you do?",
  options: [
    { text: "Say \"loads of families are different. So what?\"", heading: "Good call", isGoodChoice: true, response: "Families come in all sorts: two mums, one dad, grandparents, step-families. Ruby's is just her family.", whyItsHard: "Being the one to say it takes a bit of nerve. Keep it relaxed." },
    { text: "Ask Ruby lots of questions about it.", heading: "Lots of people would think that", response: "Being curious is fine. But right now, with people giggling, it feels like more pressure on her.", whyItsHard: "Next time, try:" },
    { text: "Just say \"cool\" to Ruby.", heading: "Kind and smart", isGoodChoice: true, response: "One word that says it's normal can mean a lot.", whyItsHard: "It feels small. Small is fine." }
  ],
  wordsToSay: "\"Loads of families are different. Two mums is cool.\""
};
