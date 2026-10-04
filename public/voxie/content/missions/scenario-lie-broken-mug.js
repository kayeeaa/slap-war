export default {
  type: "scenario",
  id: "scenario-lie-broken-mug",
  kind: "What would you do?",
  ages: [8, 10],
  difficulty: 3,
  question: "Mum's favourite mug is smashed. She thinks your little sister did it and is telling her off. It was actually you. What do you do?",
  options: [
    { text: "Say \"Mum, it was me, not her.\"", heading: "That takes guts", isGoodChoice: true, response: "Your sister's in trouble for something she didn't do. Owning up fixes that, and Mum knows she can trust you.", whyItsHard: "Your heart might be pounding. Just say the first sentence, the rest gets easier." },
    { text: "Stay quiet. She gets you in trouble loads.", heading: "Lots of people would think that", response: "Siblings can be annoying. But this time she really didn't do it, and that's not fair on her.", whyItsHard: "Next time, try:" },
    { text: "Say \"Maybe it was the cat?\"", heading: "Good guess", response: "It gets your sister off the hook. But now the cat gets the blame, and lies tend to come out.", whyItsHard: "Next time, try:" }
  ],
  wordsToSay: "\"Mum, it wasn't her. It was me. Sorry.\""
};
