export default {
  type: "scenario",
  id: "scenario-free-skins-scam",
  kind: "What would you do?",
  ages: [11, 13],
  difficulty: 3,
  question: "A message pops up in a game: \"Free legendary skins! Click this link and log in to claim before midnight!\" Your mate says it worked for his cousin. What do you do?",
  options: [
    { text: "Click it. Free is free.", heading: "Lots of people would think that", response: "\"Log in\" on a random link is how accounts get stolen. You could lose everything you've built.", whyItsHard: "Next time, try:" },
    { text: "Ignore it, report it, and tell your mate it's a scam.", heading: "Good call", isGoodChoice: true, response: "Real free stuff never needs your password. A countdown is there to rush you so you don't think.", whyItsHard: "It's tempting when someone says it worked. Ask yourself why they'd give it away for free." },
    { text: "Use your mate's login instead.", heading: "Worth thinking about", response: "Then his account gets stolen instead of yours. That's not a win.", whyItsHard: "Next time, try:" }
  ],
  wordsToSay: "\"That's a scam, don't log in on it.\""
};
