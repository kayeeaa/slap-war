export default {
  id: "wallpaper-waves-red",
  label: "Red wavy wallpaper",
  category: "house",
  slot: "house-wall",
  houseType: "wallpaper",
  roomLayer: "wall",
  unlockLevel: 80,
  rarity: "rare",
  colourName: "Red",
  colour: "#E8574A",
  drawInRoom({ fill, width, groundTop }) {
    fill(0, 0, width, groundTop, "#F4C2BC");
    for (let y = 2; y < groundTop - 5; y += 6) for (let x = 0; x < width; x++) fill(x, y + Math.round(Math.sin(x / 2) * 1.5), 1, 2, "#E8574A");
    fill(0, groundTop - 3, width, 3, "#B8322A"); fill(0, groundTop - 3, width, 1, "#8A2219");
  }
};
