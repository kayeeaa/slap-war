export default {
  id: "wallpaper-stripes-red",
  label: "Red stripy wallpaper",
  category: "house",
  slot: "house-wall",
  houseType: "wallpaper",
  roomLayer: "wall",
  unlockLevel: 40,
  rarity: "common",
  colourName: "Red",
  colour: "#E8574A",
  drawInRoom({ fill, width, groundTop }) {
    fill(0, 0, width, groundTop, "#F4C2BC");
    for (let x = 1; x < width; x += 8) fill(x, 0, 3, groundTop, "#E8574A");
    fill(0, groundTop - 3, width, 3, "#B8322A"); fill(0, groundTop - 3, width, 1, "#8A2219");
  }
};
