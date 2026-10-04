export default {
  type: "scenario",
  id: "scenario-excluded-new-group",
  kind: "What would you do?",
  ages: [11, 13],
  difficulty: 3,
  question: "You started Year 7 with your best mate. Now she's in a new group, and they're making plans in a chat you're not in. What do you do?",
  options: [
    { text: "Post something to make them jealous.", heading: "Lots of people would think that", response: "Totally understandable when you're hurt. But it usually makes things more awkward, not less.", whyItsHard: "Next time, try:" },
    { text: "Tell her honestly that you miss hanging out.", heading: "That takes guts", isGoodChoice: true, response: "She might not even realise. Being honest gives her a chance to fix it.", whyItsHard: "Saying you're hurt feels exposed. Keep it simple." },
    { text: "Find a couple of other people to hang out with too.", heading: "Spot on", isGoodChoice: true, response: "Friendships shift a lot in Year 7. Having a few people around you means it doesn't hurt as much.", whyItsHard: "It's hard to start again. Join a club or sit with someone new." }
  ],
  wordsToSay: "\"Miss hanging out with you. Fancy doing something Saturday?\""
};
