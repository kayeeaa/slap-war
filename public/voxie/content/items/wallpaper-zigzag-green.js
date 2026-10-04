export default {
  id: "wallpaper-zigzag-green",
  label: "Green zigzag wallpaper",
  category: "house",
  slot: "house-wall",
  houseType: "wallpaper",
  roomLayer: "wall",
  unlockLevel: 86,
  rarity: "rare",
  colourName: "Green",
  colour: "#5DAE4F",
  drawInRoom({ fill, width, groundTop }) {
    fill(0, 0, width, groundTop, "#CDEBC0");
    for (let y = 1; y < groundTop - 5; y += 7) for (let x = 0; x < width; x++) {
      const step = x % 8, rise = step < 4 ? step : 7 - step;
      fill(x, y + rise, 1, 2, "#5DAE4F");
    }
    fill(0, groundTop - 3, width, 3, "#3E8A35"); fill(0, groundTop - 3, width, 1, "#2A6324");
  }
};
