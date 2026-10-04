export default {
  id: "wallpaper-stripes-blue",
  label: "Blue stripy wallpaper",
  category: "house",
  slot: "house-wall",
  houseType: "wallpaper",
  roomLayer: "wall",
  unlockLevel: 20,
  rarity: "common",
  colourName: "Blue",
  colour: "#3E8EDB",
  drawInRoom({ fill, width, groundTop }) {
    fill(0, 0, width, groundTop, "#C6DDF5");
    for (let x = 1; x < width; x += 8) fill(x, 0, 3, groundTop, "#3E8EDB");
    fill(0, groundTop - 3, width, 3, "#2A65A8"); fill(0, groundTop - 3, width, 1, "#1C4578");
  }
};
