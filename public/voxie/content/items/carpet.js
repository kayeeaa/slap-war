export default {
  id: "carpet", label: "Carpet", category: "house", houseType: "floor", slot: "house-floor", roomLayer: "floor", unlockLevel: 14, rarity: "rare", colourName: "Your game colour",
  drawInRoom({ fill, width, height, groundTop, themeShade }) {
    fill(0, groundTop - 2, width, 2, "#FFFFFF");
    fill(0, groundTop, width, height - groundTop, themeShade(58));
    for (let x = 1; x < width; x += 3) fill(x, groundTop + 1 + ((x * 5) % (height - groundTop - 1)), 1, 1, themeShade(50));
  }
};
