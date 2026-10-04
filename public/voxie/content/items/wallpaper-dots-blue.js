export default {
  id: "wallpaper-dots-blue",
  label: "Blue polka dot wallpaper",
  category: "house",
  slot: "house-wall",
  houseType: "wallpaper",
  roomLayer: "wall",
  unlockLevel: 94,
  rarity: "common",
  colourName: "Blue",
  colour: "#3E8EDB",
  drawInRoom({ fill, width, groundTop }) {
    fill(0, 0, width, groundTop, "#C6DDF5");
    for (let y = 2; y < groundTop - 4; y += 6) for (let x = (y / 6) % 2 < 1 ? 1 : 5; x < width; x += 8) fill(x, y, 2, 2, "#3E8EDB");
    fill(0, groundTop - 3, width, 3, "#2A65A8"); fill(0, groundTop - 3, width, 1, "#1C4578");
  }
};
