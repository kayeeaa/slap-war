export default {
  id: "wallpaper-zigzag-red",
  label: "Red zigzag wallpaper",
  category: "house",
  slot: "house-wall",
  houseType: "wallpaper",
  roomLayer: "wall",
  unlockLevel: 97,
  rarity: "rare",
  colourName: "Red",
  colour: "#E8574A",
  drawInRoom({ fill, width, groundTop }) {
    fill(0, 0, width, groundTop, "#F4C2BC");
    for (let y = 1; y < groundTop - 5; y += 7) for (let x = 0; x < width; x++) {
      const step = x % 8, rise = step < 4 ? step : 7 - step;
      fill(x, y + rise, 1, 2, "#E8574A");
    }
    fill(0, groundTop - 3, width, 3, "#B8322A"); fill(0, groundTop - 3, width, 1, "#8A2219");
  }
};
