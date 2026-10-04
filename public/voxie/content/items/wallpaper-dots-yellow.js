export default {
  id: "wallpaper-dots-yellow",
  label: "Yellow polka dot wallpaper",
  category: "house",
  slot: "house-wall",
  houseType: "wallpaper",
  roomLayer: "wall",
  unlockLevel: 42,
  rarity: "common",
  colourName: "Yellow",
  colour: "#F6C445",
  drawInRoom({ fill, width, groundTop }) {
    fill(0, 0, width, groundTop, "#FBEBB0");
    for (let y = 2; y < groundTop - 4; y += 6) for (let x = (y / 6) % 2 < 1 ? 1 : 5; x < width; x += 8) fill(x, y, 2, 2, "#F6C445");
    fill(0, groundTop - 3, width, 3, "#C99A1C"); fill(0, groundTop - 3, width, 1, "#8E6A0E");
  }
};
