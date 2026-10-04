export default {
  id: "wallpaper-waves-blue",
  label: "Blue wavy wallpaper",
  category: "house",
  slot: "house-wall",
  houseType: "wallpaper",
  roomLayer: "wall",
  unlockLevel: 59,
  rarity: "rare",
  colourName: "Blue",
  colour: "#3E8EDB",
  drawInRoom({ fill, width, groundTop }) {
    fill(0, 0, width, groundTop, "#C6DDF5");
    for (let y = 2; y < groundTop - 5; y += 6) for (let x = 0; x < width; x++) fill(x, y + Math.round(Math.sin(x / 2) * 1.5), 1, 2, "#3E8EDB");
    fill(0, groundTop - 3, width, 3, "#2A65A8"); fill(0, groundTop - 3, width, 1, "#1C4578");
  }
};
