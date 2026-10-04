export default {
  id: "wallpaper-waves-black",
  label: "Black wavy wallpaper",
  category: "house",
  slot: "house-wall",
  houseType: "wallpaper",
  roomLayer: "wall",
  unlockLevel: 49,
  rarity: "rare",
  colourName: "Black",
  colour: "#6A7182",
  drawInRoom({ fill, width, groundTop }) {
    fill(0, 0, width, groundTop, "#3A3F4B");
    for (let y = 2; y < groundTop - 5; y += 6) for (let x = 0; x < width; x++) fill(x, y + Math.round(Math.sin(x / 2) * 1.5), 1, 2, "#6A7182");
    fill(0, groundTop - 3, width, 3, "#22252D"); fill(0, groundTop - 3, width, 1, "#14161B");
  }
};
