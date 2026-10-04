export default {
  id: "wallpaper-zigzag-black",
  label: "Black zigzag wallpaper",
  category: "house",
  slot: "house-wall",
  houseType: "wallpaper",
  roomLayer: "wall",
  unlockLevel: 66,
  rarity: "rare",
  colourName: "Black",
  colour: "#6A7182",
  drawInRoom({ fill, width, groundTop }) {
    fill(0, 0, width, groundTop, "#3A3F4B");
    for (let y = 1; y < groundTop - 5; y += 7) for (let x = 0; x < width; x++) {
      const step = x % 8, rise = step < 4 ? step : 7 - step;
      fill(x, y + rise, 1, 2, "#6A7182");
    }
    fill(0, groundTop - 3, width, 3, "#22252D"); fill(0, groundTop - 3, width, 1, "#14161B");
  }
};
