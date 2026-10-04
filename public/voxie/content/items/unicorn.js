export default {
  id: "unicorn",
  label: "Unicorn",
  category: "pets",
  slot: "companion",
  chanceOnly: true,
  rarity: "insane",
  chanceWithinRarity: 0.05,
  abilities: { advanced: "lucky", master: "bonus-mission" },
  colourName: "White",
  colour: "#F3F6F9",
  sprite: {
    pixels: [
      "........Y.",
      ".......Y..",
      "......PWW.",
      ".....PWKWW",
      "P...PWWWW.",
      "PWWWWWWW..",
      ".WWWWWWW..",
      ".W.W..W.W."
    ],
    colours: { Y: "#F6D44A", P: "#F2A7C3", W: "#F3F6F9", K: "#1E1612" }
  }
};
