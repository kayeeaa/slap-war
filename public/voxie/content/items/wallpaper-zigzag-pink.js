export default {
  id: "wallpaper-zigzag-pink",
  label: "Pink zigzag wallpaper",
  category: "house",
  slot: "house-wall",
  houseType: "wallpaper",
  roomLayer: "wall",
  unlockLevel: 56,
  rarity: "rare",
  colourName: "Pink",
  colour: "#F2669B",
  drawInRoom({ fill, width, groundTop }) {
    fill(0, 0, width, groundTop, "#F9D2E3");
    for (let y = 1; y < groundTop - 5; y += 7) for (let x = 0; x < width; x++) {
      const step = x % 8, rise = step < 4 ? step : 7 - step;
      fill(x, y + rise, 1, 2, "#F2669B");
    }
    fill(0, groundTop - 3, width, 3, "#C2456F"); fill(0, groundTop - 3, width, 1, "#8E2E50");
  }
};
