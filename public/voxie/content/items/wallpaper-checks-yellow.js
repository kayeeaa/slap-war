export default {
  id: "wallpaper-checks-yellow",
  label: "Yellow check wallpaper",
  category: "house",
  slot: "house-wall",
  houseType: "wallpaper",
  roomLayer: "wall",
  unlockLevel: 34,
  rarity: "common",
  colourName: "Yellow",
  colour: "#F6C445",
  drawInRoom({ fill, width, groundTop }) {
    fill(0, 0, width, groundTop, "#FBEBB0");
    for (let x = 0; x < width; x += 8) fill(x, 0, 4, groundTop, "#F6C445");
    for (let y = 0; y < groundTop; y += 8) fill(0, y, width, 4, "#F6C445");
    for (let x = 0; x < width; x += 8) for (let y = 0; y < groundTop; y += 8) fill(x, y, 4, 4, "#C99A1C");
    fill(0, groundTop - 3, width, 3, "#C99A1C"); fill(0, groundTop - 3, width, 1, "#8E6A0E");
  }
};
