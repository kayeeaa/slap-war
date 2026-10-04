export default {
  id: "wallpaper-diamonds-green",
  label: "Green diamond wallpaper",
  category: "house",
  slot: "house-wall",
  houseType: "wallpaper",
  roomLayer: "wall",
  unlockLevel: 78,
  rarity: "rare",
  colourName: "Green",
  colour: "#5DAE4F",
  drawInRoom({ fill, width, groundTop }) {
    fill(0, 0, width, groundTop, "#CDEBC0");
    for (let y = 4, row = 0; y < groundTop - 3; y += 8, row++) for (let x = row % 2 ? 4 : 0, n = 0; x < width + 4; x += 8, n++) {
      const colour = (n + row) % 2 ? "#5DAE4F" : "#3E8A35";
      for (let d = 0; d < 4; d++) { fill(x - d, y - 3 + d, d * 2 + 1, 1, colour); fill(x - d, y + 3 - d, d * 2 + 1, 1, colour); }
    }
    fill(0, groundTop - 3, width, 3, "#3E8A35"); fill(0, groundTop - 3, width, 1, "#2A6324");
  }
};
