export default {
  id: "wallpaper-checks-black",
  label: "Black check wallpaper",
  category: "house",
  slot: "house-wall",
  houseType: "wallpaper",
  roomLayer: "wall",
  unlockLevel: 74,
  rarity: "common",
  colourName: "Black",
  colour: "#6A7182",
  drawInRoom({ fill, width, groundTop }) {
    fill(0, 0, width, groundTop, "#3A3F4B");
    for (let x = 0; x < width; x += 8) fill(x, 0, 4, groundTop, "#6A7182");
    for (let y = 0; y < groundTop; y += 8) fill(0, y, width, 4, "#6A7182");
    for (let x = 0; x < width; x += 8) for (let y = 0; y < groundTop; y += 8) fill(x, y, 4, 4, "#22252D");
    fill(0, groundTop - 3, width, 3, "#22252D"); fill(0, groundTop - 3, width, 1, "#14161B");
  }
};
