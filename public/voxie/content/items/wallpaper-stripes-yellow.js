export default {
  id: "wallpaper-stripes-yellow",
  label: "Yellow stripy wallpaper",
  category: "house",
  slot: "house-wall",
  houseType: "wallpaper",
  roomLayer: "wall",
  unlockLevel: 51,
  rarity: "common",
  colourName: "Yellow",
  colour: "#F6C445",
  drawInRoom({ fill, width, groundTop }) {
    fill(0, 0, width, groundTop, "#FBEBB0");
    for (let x = 1; x < width; x += 8) fill(x, 0, 3, groundTop, "#F6C445");
    fill(0, groundTop - 3, width, 3, "#C99A1C"); fill(0, groundTop - 3, width, 1, "#8E6A0E");
  }
};
