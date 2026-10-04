export default {
  id: "wallpaper-zigzag-blue",
  label: "Blue zigzag wallpaper",
  category: "house",
  slot: "house-wall",
  houseType: "wallpaper",
  roomLayer: "wall",
  unlockLevel: 77,
  rarity: "rare",
  colourName: "Blue",
  colour: "#3E8EDB",
  drawInRoom({ fill, width, groundTop }) {
    fill(0, 0, width, groundTop, "#C6DDF5");
    for (let y = 1; y < groundTop - 5; y += 7) for (let x = 0; x < width; x++) {
      const step = x % 8, rise = step < 4 ? step : 7 - step;
      fill(x, y + rise, 1, 2, "#3E8EDB");
    }
    fill(0, groundTop - 3, width, 3, "#2A65A8"); fill(0, groundTop - 3, width, 1, "#1C4578");
  }
};
