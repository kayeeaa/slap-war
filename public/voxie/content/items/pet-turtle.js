export default {
  id: "pet-turtle", abilities: { advanced: "extra-time" }, label: "Turtle", category: "pets", slot: "companion", unlockLevel: 8, rarity: "common", colourName: "Green", colour: "#3E8E41",
  drawOnFloor({ fill }, x, g) {
    fill(x + 2, g - 5, 3, 1, "#3E8E41"); fill(x + 1, g - 4, 5, 2, "#3E8E41"); fill(x + 3, g - 4, 1, 1, "#7BC67E"); fill(x + 2, g - 3, 1, 1, "#7BC67E"); fill(x + 4, g - 3, 1, 1, "#7BC67E");
    fill(x + 6, g - 4, 2, 2, "#8BC34A"); fill(x + 7, g - 4, 1, 1, "#2A2A2A"); fill(x + 1, g - 2, 1, 1, "#8BC34A"); fill(x + 5, g - 2, 1, 1, "#8BC34A"); fill(x, g - 3, 1, 1, "#8BC34A");
  }
};
