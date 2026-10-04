export default {
  type: "scenario",
  id: "scenario-dare-fence",
  kind: "What would you do?",
  ages: [8, 10],
  difficulty: 3,
  question: "Your friends dare you to climb the tall fence at the back of the field. \"Don't be a chicken!\" they shout. What do you do?",
  options: [
    { text: "Say no and laugh it off.", heading: "That takes guts", isGoodChoice: true, response: "Saying no to a dare is braver than doing it. Real mates move on quickly.", whyItsHard: "They might tease you for a minute. Having a jokey line ready helps." },
    { text: "Do it so they stop going on.", heading: "Lots of people would think that", response: "That's normal to want. But you could get hurt, and then they'll want another dare next time.", whyItsHard: "Next time, try:" },
    { text: "Dare someone else to do it instead.", heading: "Good guess", response: "Smart way out for you, but now it's someone else who might get hurt.", whyItsHard: "Next time, try:" }
  ],
  wordsToSay: "\"Nah, I like my legs not broken, thanks.\""
};
