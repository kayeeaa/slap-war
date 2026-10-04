export default {
  id: "wallpaper-checks-blue",
  label: "Blue check wallpaper",
  category: "house",
  slot: "house-wall",
  houseType: "wallpaper",
  roomLayer: "wall",
  unlockLevel: 85,
  rarity: "common",
  colourName: "Blue",
  colour: "#3E8EDB",
  drawInRoom({ fill, width, groundTop }) {
    fill(0, 0, width, groundTop, "#C6DDF5");
    for (let x = 0; x < width; x += 8) fill(x, 0, 4, groundTop, "#3E8EDB");
    for (let y = 0; y < groundTop; y += 8) fill(0, y, width, 4, "#3E8EDB");
    for (let x = 0; x < width; x += 8) for (let y = 0; y < groundTop; y += 8) fill(x, y, 4, 4, "#2A65A8");
    fill(0, groundTop - 3, width, 3, "#2A65A8"); fill(0, groundTop - 3, width, 1, "#1C4578");
  }
};
