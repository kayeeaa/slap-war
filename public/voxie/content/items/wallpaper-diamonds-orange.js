export default {
  id: "wallpaper-diamonds-orange",
  label: "Orange diamond wallpaper",
  category: "house",
  slot: "house-wall",
  houseType: "wallpaper",
  roomLayer: "wall",
  unlockLevel: 37,
  rarity: "rare",
  colourName: "Orange",
  colour: "#F28C28",
  drawInRoom({ fill, width, groundTop }) {
    fill(0, 0, width, groundTop, "#F9D3A8");
    for (let y = 4, row = 0; y < groundTop - 3; y += 8, row++) for (let x = row % 2 ? 4 : 0, n = 0; x < width + 4; x += 8, n++) {
      const colour = (n + row) % 2 ? "#F28C28" : "#C46A12";
      for (let d = 0; d < 4; d++) { fill(x - d, y - 3 + d, d * 2 + 1, 1, colour); fill(x - d, y + 3 - d, d * 2 + 1, 1, colour); }
    }
    fill(0, groundTop - 3, width, 3, "#C46A12"); fill(0, groundTop - 3, width, 1, "#8E4A0A");
  }
};
