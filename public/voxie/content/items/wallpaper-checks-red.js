export default {
  id: "wallpaper-checks-red",
  label: "Red check wallpaper",
  category: "house",
  slot: "house-wall",
  houseType: "wallpaper",
  roomLayer: "wall",
  unlockLevel: 24,
  rarity: "common",
  colourName: "Red",
  colour: "#E8574A",
  drawInRoom({ fill, width, groundTop }) {
    fill(0, 0, width, groundTop, "#F4C2BC");
    for (let x = 0; x < width; x += 8) fill(x, 0, 4, groundTop, "#E8574A");
    for (let y = 0; y < groundTop; y += 8) fill(0, y, width, 4, "#E8574A");
    for (let x = 0; x < width; x += 8) for (let y = 0; y < groundTop; y += 8) fill(x, y, 4, 4, "#B8322A");
    fill(0, groundTop - 3, width, 3, "#B8322A"); fill(0, groundTop - 3, width, 1, "#8A2219");
  }
};
