export default {
  id: "wallpaper-zigzag-purple",
  label: "Purple zigzag wallpaper",
  category: "house",
  slot: "house-wall",
  houseType: "wallpaper",
  roomLayer: "wall",
  unlockLevel: 36,
  rarity: "rare",
  colourName: "Purple",
  colour: "#8E6BEA",
  drawInRoom({ fill, width, groundTop }) {
    fill(0, 0, width, groundTop, "#DCCDF5");
    for (let y = 1; y < groundTop - 5; y += 7) for (let x = 0; x < width; x++) {
      const step = x % 8, rise = step < 4 ? step : 7 - step;
      fill(x, y + rise, 1, 2, "#8E6BEA");
    }
    fill(0, groundTop - 3, width, 3, "#5B3FB8"); fill(0, groundTop - 3, width, 1, "#3E2A85");
  }
};
