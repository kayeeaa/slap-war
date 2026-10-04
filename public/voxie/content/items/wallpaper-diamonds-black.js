export default {
  id: "wallpaper-diamonds-black",
  label: "Black diamond wallpaper",
  category: "house",
  slot: "house-wall",
  houseType: "wallpaper",
  roomLayer: "wall",
  unlockLevel: 57,
  rarity: "rare",
  colourName: "Black",
  colour: "#6A7182",
  drawInRoom({ fill, width, groundTop }) {
    fill(0, 0, width, groundTop, "#3A3F4B");
    for (let y = 4, row = 0; y < groundTop - 3; y += 8, row++) for (let x = row % 2 ? 4 : 0, n = 0; x < width + 4; x += 8, n++) {
      const colour = (n + row) % 2 ? "#6A7182" : "#22252D";
      for (let d = 0; d < 4; d++) { fill(x - d, y - 3 + d, d * 2 + 1, 1, colour); fill(x - d, y + 3 - d, d * 2 + 1, 1, colour); }
    }
    fill(0, groundTop - 3, width, 3, "#22252D"); fill(0, groundTop - 3, width, 1, "#14161B");
  }
};
