export default {
  id: "wallpaper-zigzag-orange",
  label: "Orange zigzag wallpaper",
  category: "house",
  slot: "house-wall",
  houseType: "wallpaper",
  roomLayer: "wall",
  unlockLevel: 46,
  rarity: "rare",
  colourName: "Orange",
  colour: "#F28C28",
  drawInRoom({ fill, width, groundTop }) {
    fill(0, 0, width, groundTop, "#F9D3A8");
    for (let y = 1; y < groundTop - 5; y += 7) for (let x = 0; x < width; x++) {
      const step = x % 8, rise = step < 4 ? step : 7 - step;
      fill(x, y + rise, 1, 2, "#F28C28");
    }
    fill(0, groundTop - 3, width, 3, "#C46A12"); fill(0, groundTop - 3, width, 1, "#8E4A0A");
  }
};
