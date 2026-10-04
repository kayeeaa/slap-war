export default {
  id: "pet-bunny", abilities: { advanced: "lucky", master: "daring" }, label: "Bunny", category: "pets", slot: "companion", unlockLevel: 12, rarity: "rare", colourName: "White", colour: "#F4F4F2",
  drawOnFloor({ fill }, x, g) {
    fill(x, g - 4, 5, 3, "#F4F4F2"); fill(x + 3, g - 7, 3, 3, "#F4F4F2"); fill(x + 3, g - 10, 1, 3, "#F4F4F2"); fill(x + 5, g - 10, 1, 3, "#F4F4F2");
    fill(x + 5, g - 9, 1, 1, "#F2A7C3"); fill(x + 4, g - 6, 1, 1, "#2A2A2A"); fill(x + 5, g - 5, 1, 1, "#F2A7C3"); fill(x - 1, g - 4, 1, 1, "#FFFFFF");
    fill(x, g - 1, 2, 1, "#D6D6D1"); fill(x + 3, g - 1, 2, 1, "#D6D6D1");
  }
};
