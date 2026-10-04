export default {
  id: "painted-wall", label: "Painted wall", category: "house", houseType: "wallpaper", slot: "house-wall", roomLayer: "wall", unlockLevel: 7, rarity: "common", colourName: "Your game colour",
  drawInRoom({ fill, width, groundTop, themeShade }) {
    fill(0, 0, width, groundTop, themeShade(80));
    fill(0, groundTop - 3, width, 1, themeShade(70));
  }
};
