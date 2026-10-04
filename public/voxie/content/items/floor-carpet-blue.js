export default {
  id: "floor-carpet-blue",
  label: "Blue carpet",
  category: "house",
  slot: "house-floor",
  houseType: "floor",
  roomLayer: "floor",
  unlockLevel: 82,
  rarity: "common",
  colourName: "Blue",
  colour: "#3E8EDB",
  drawInRoom({ fill, width, height, groundTop }) {
    fill(0, groundTop - 2, width, 2, "#FFFFFF");
    fill(0, groundTop, width, height - groundTop, "#3E8EDB");
    for (let x = 1; x < width; x += 3) fill(x, groundTop + 1 + ((x * 5) % Math.max(2, height - groundTop - 1)), 1, 1, "#2A65A8");
    for (let x = 2; x < width; x += 5) fill(x, groundTop + 2 + ((x * 3) % Math.max(2, height - groundTop - 2)), 1, 1, "#C6DDF5");
  }
};
