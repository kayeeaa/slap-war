export default {
  type: "scenario",
  id: "scenario-screen-time-ends",
  kind: "What would you do?",
  ages: [8, 10],
  difficulty: 3,
  question: "You're one jump from the end of a level when Dad says, \"Screen time's up.\" What do you do?",
  options: [
    { text: "Ask for two minutes, then actually stop.", heading: "Good call", isGoodChoice: true, response: "Asking nicely and keeping your word means Dad trusts you with \"two more minutes\" next time.", whyItsHard: "Stopping mid-game is hard. Set a timer so it's the timer telling you, not Dad." },
    { text: "Keep playing and pretend you didn't hear.", heading: "Lots of people would think that", response: "Everyone's tried it. It usually ends with less screen time, not more.", whyItsHard: "Next time, try:" },
    { text: "Shout \"that's SO unfair!\"", heading: "Good guess", response: "Feeling annoyed is normal. A strop just makes the next screen time chat harder.", whyItsHard: "Next time, try:" }
  ],
  wordsToSay: "\"Can I just finish this level? Two minutes, promise.\""
};
