export default {
  type: "scenario",
  id: "scenario-edited-picture-classmate",
  kind: "What would you do?",
  ages: [11, 13],
  difficulty: 3,
  question: "Someone's edited a picture of Theo so his head is on a baby's body. It's going round every chat and it's spreading fast. What do you do?",
  options: [
    { text: "Don't send it on, and tell a teacher.", heading: "Good call", isGoodChoice: true, response: "Edited pictures of real people can follow someone for ages. Teachers deal with this stuff and can get it taken down.", whyItsHard: "Telling can feel like snitching. It's not, when something is spreading and hurting someone." },
    { text: "Forward it to one friend. Everyone's seen it anyway.", heading: "Lots of people would think that", response: "\"Everyone's seen it\" is what everyone says, and that's how it reaches everyone.", whyItsHard: "Next time, try:" },
    { text: "Reply \"this is a bit much, delete it\".", heading: "That takes guts", isGoodChoice: true, response: "Saying it out loud gives other people permission to stop too.", whyItsHard: "You might get an eye-roll. Keep it short, then mute the chat." }
  ],
  wordsToSay: "\"Not forwarding that, it's actually a bit grim.\""
};
