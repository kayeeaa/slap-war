export default {
  type: "scenario",
  id: "scenario-account-verification-scam",
  kind: "What would you do?",
  ages: [11, 13],
  difficulty: 3,
  question: "You get a message: \"Your account will be deleted in 24 hours. Verify now by sending your password and the code we text you.\" What do you do?",
  options: [
    { text: "Send it quickly. You don't want to lose your account.", heading: "Lots of people would think that", response: "That panic is exactly what scammers want. Real companies never ask for your password or code.", whyItsHard: "Next time, try:" },
    { text: "Don't reply. Show a grown-up and change your password.", heading: "Spot on", isGoodChoice: true, response: "Anyone asking for your code is trying to get into your account. Changing your password locks them out.", whyItsHard: "The deadline makes it feel urgent. Fake deadlines are the biggest giveaway." },
    { text: "Reply asking if it's real.", heading: "Close!", response: "A scammer will just say yes. Don't reply at all.", whyItsHard: "Next time, try:" }
  ],
  wordsToSay: "\"Got this weird message, is it a scam?\""
};
