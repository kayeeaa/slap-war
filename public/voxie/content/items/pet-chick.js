export default {
  id: "pet-chick", abilities: { advanced: "streak-shield" }, label: "Chick", category: "pets", slot: "companion", unlockLevel: 4, rarity: "common", colourName: "Yellow", colour: "#F6D44A",
  drawOnFloor({ fill }, x, g) {
    fill(x + 1, g - 4, 4, 3, "#F6D44A"); fill(x + 1, g - 3, 2, 1, "#E9BF2E"); fill(x + 3, g - 7, 3, 3, "#F6D44A");
    fill(x + 4, g - 6, 1, 1, "#2A2A2A"); fill(x + 6, g - 6, 1, 1, "#F29A2E"); fill(x + 2, g - 1, 1, 1, "#E08A1E"); fill(x + 4, g - 1, 1, 1, "#E08A1E");
  }
};
