export default {
  id: "wooden-floor", label: "Wooden floor", category: "house", houseType: "floor", slot: "house-floor", roomLayer: "floor", unlockLevel: 6, rarity: "rare", colourName: "Wood brown", colour: "#B98552",
  drawInRoom({ fill, width, height, groundTop }) {
    fill(0, groundTop - 2, width, 2, "#FFFFFF");
    fill(0, groundTop, width, height - groundTop, "#B98552");
    for (let y = groundTop + 3; y < height; y += 4) fill(0, y, width, 1, "#A3713F");
  }
};
