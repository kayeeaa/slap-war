export default {
  id: "wallpaper-waves-yellow",
  label: "Yellow wavy wallpaper",
  category: "house",
  slot: "house-wall",
  houseType: "wallpaper",
  roomLayer: "wall",
  unlockLevel: 89,
  rarity: "rare",
  colourName: "Yellow",
  colour: "#F6C445",
  drawInRoom({ fill, width, groundTop }) {
    fill(0, 0, width, groundTop, "#FBEBB0");
    for (let y = 2; y < groundTop - 5; y += 6) for (let x = 0; x < width; x++) fill(x, y + Math.round(Math.sin(x / 2) * 1.5), 1, 2, "#F6C445");
    fill(0, groundTop - 3, width, 3, "#C99A1C"); fill(0, groundTop - 3, width, 1, "#8E6A0E");
  }
};
