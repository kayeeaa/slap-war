export default {
  id: "floor-tiles-purple",
  label: "Purple tiles",
  category: "house",
  slot: "house-floor",
  houseType: "floor",
  roomLayer: "floor",
  unlockLevel: 58,
  rarity: "common",
  colourName: "Purple",
  colour: "#8E6BEA",
  drawInRoom({ fill, width, height, groundTop }) {
    fill(0, groundTop - 2, width, 2, "#FFFFFF");
    fill(0, groundTop, width, height - groundTop, "#8E6BEA");
    for (let y = groundTop; y < height; y += 4) fill(0, y, width, 1, "#DCCDF5");
    for (let y = groundTop, row = 0; y < height; y += 4, row++) for (let x = row % 2 ? 3 : 0; x < width; x += 6) fill(x, y, 1, 4, "#DCCDF5");
  }
};
