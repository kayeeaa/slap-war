export default {
  id: "wallpaper-diamonds-pink",
  label: "Pink diamond wallpaper",
  category: "house",
  slot: "house-wall",
  houseType: "wallpaper",
  roomLayer: "wall",
  unlockLevel: 48,
  rarity: "rare",
  colourName: "Pink",
  colour: "#F2669B",
  drawInRoom({ fill, width, groundTop }) {
    fill(0, 0, width, groundTop, "#F9D2E3");
    for (let y = 4, row = 0; y < groundTop - 3; y += 8, row++) for (let x = row % 2 ? 4 : 0, n = 0; x < width + 4; x += 8, n++) {
      const colour = (n + row) % 2 ? "#F2669B" : "#C2456F";
      for (let d = 0; d < 4; d++) { fill(x - d, y - 3 + d, d * 2 + 1, 1, colour); fill(x - d, y + 3 - d, d * 2 + 1, 1, colour); }
    }
    fill(0, groundTop - 3, width, 3, "#C2456F"); fill(0, groundTop - 3, width, 1, "#8E2E50");
  }
};
