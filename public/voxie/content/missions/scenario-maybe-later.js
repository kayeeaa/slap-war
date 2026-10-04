export default { type:"scenario", id:"scenario-maybe-later", difficulty:3, kind:"What would you do?",
  question:"You ask your friend if you can have a go on his controller. He says \"maybe later\". What does \"maybe later\" mean?",
  options:[
    { text:"Not right now, so I wait.", heading:"Spot on", isGoodChoice:true, response:"\"Maybe\" isn't a yes. You wait until you get a proper yes.", whyItsHard:"Waiting is boring. But grabbing it would make him trust you less." },
    { text:"Basically yes, so I can take it.", heading:"Lots of people get this one mixed up", response:"\"Maybe\" means he hasn't said yes. Only a yes is a yes.", whyItsHard:"If you're not sure, you can just ask:" },
    { text:"Ask again ten times until he says yes.", heading:"Worth thinking about", response:"Asking over and over is pressure. A yes you get by nagging isn't a real yes.", whyItsHard:"Next time, try:" }],
  wordsToSay:"\"Cool, just tell me when you're done.\"" };
