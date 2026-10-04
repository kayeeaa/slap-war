export default {
  id: "wallpaper-dots-red",
  label: "Red polka dot wallpaper",
  category: "house",
  slot: "house-wall",
  houseType: "wallpaper",
  roomLayer: "wall",
  unlockLevel: 33,
  rarity: "common",
  colourName: "Red",
  colour: "#E8574A",
  drawInRoom({ fill, width, groundTop }) {
    fill(0, 0, width, groundTop, "#F4C2BC");
    for (let y = 2; y < groundTop - 4; y += 6) for (let x = (y / 6) % 2 < 1 ? 1 : 5; x < width; x += 8) fill(x, y, 2, 2, "#E8574A");
    fill(0, groundTop - 3, width, 3, "#B8322A"); fill(0, groundTop - 3, width, 1, "#8A2219");
  }
};
