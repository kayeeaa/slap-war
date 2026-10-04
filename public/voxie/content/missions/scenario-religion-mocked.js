export default {
  type: "scenario",
  id: "scenario-religion-mocked",
  kind: "What would you do?",
  ages: [11, 13],
  difficulty: 3,
  question: "It's Ramadan and Aisha is fasting. At lunch, a couple of people keep waving crisps in her face going \"go on, just one\". She's smiling but looks fed up. What do you do?",
  options: [
    { text: "Laugh. It's only a joke.", heading: "Lots of people would think that", response: "She's smiling to keep the peace. Being teased over something you believe in gets old fast.", whyItsHard: "Next time, try:" },
    { text: "\"Leave it, she's fasting.\"", heading: "Good call", isGoodChoice: true, response: "Respecting what someone believes doesn't mean you have to believe it too.", whyItsHard: "Calling it out can feel awkward. Say it lightly." },
    { text: "Ask Aisha if she wants to sit somewhere else with you.", heading: "Kind and smart", isGoodChoice: true, response: "Giving her a way out quietly can be just as good as saying something.", whyItsHard: "It can feel like you're not doing much. Getting her out of there is a lot." }
  ],
  wordsToSay: "\"Leave it, she's fasting. Fancy sitting over there?\""
};
