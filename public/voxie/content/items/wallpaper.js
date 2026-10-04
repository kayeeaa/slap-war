export default {
  id: "wallpaper", label: "Wallpaper", category: "house", houseType: "wallpaper", slot: "house-wall", roomLayer: "wall", unlockLevel: 10, rarity: "rare", colourName: "Cream", colour: "#F3E6CF",
  drawInRoom({ fill, width, groundTop }) {
    fill(0, 0, width, groundTop, "#F3E6CF");
    for (let x = 2; x < width; x += 6) fill(x, 0, 2, groundTop, "#EADBC0");
  }
};
