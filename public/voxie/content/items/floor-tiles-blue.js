export default {
  id: "floor-tiles-blue",
  label: "Blue tiles",
  category: "house",
  slot: "house-floor",
  houseType: "floor",
  roomLayer: "floor",
  unlockLevel: 23,
  rarity: "common",
  colourName: "Blue",
  colour: "#3E8EDB",
  drawInRoom({ fill, width, height, groundTop }) {
    fill(0, groundTop - 2, width, 2, "#FFFFFF");
    fill(0, groundTop, width, height - groundTop, "#3E8EDB");
    for (let y = groundTop; y < height; y += 4) fill(0, y, width, 1, "#C6DDF5");
    for (let y = groundTop, row = 0; y < height; y += 4, row++) for (let x = row % 2 ? 3 : 0; x < width; x += 6) fill(x, y, 1, 4, "#C6DDF5");
  }
};
