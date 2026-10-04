export default {
  id: "pet-dragon", abilities: { advanced: "brain-boost", master: "bonus-mission" }, label: "Mini dragon", category: "pets", slot: "companion", unlockLevel: 19, rarity: "insane", colourName: "Purple", colour: "#8E5CD9",
  drawOnFloor({ fill }, x, g) {
    fill(x + 1, g - 4, 5, 3, "#8E5CD9"); fill(x + 2, g - 2, 3, 1, "#C9B2F2"); fill(x + 5, g - 7, 3, 3, "#8E5CD9"); fill(x + 6, g - 6, 1, 1, "#FFD34D");
    fill(x + 5, g - 8, 1, 1, "#F2C95C"); fill(x + 7, g - 8, 1, 1, "#F2C95C"); fill(x + 1, g - 7, 3, 1, "#6E3FBF"); fill(x + 2, g - 6, 2, 2, "#6E3FBF");
    fill(x - 1, g - 3, 2, 1, "#8E5CD9"); fill(x - 2, g - 4, 1, 1, "#8E5CD9"); fill(x + 2, g - 1, 1, 1, "#6E3FBF"); fill(x + 4, g - 1, 1, 1, "#6E3FBF");
  }
};
