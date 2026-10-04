export default {
  id: "floor-carpet-purple",
  label: "Purple carpet",
  category: "house",
  slot: "house-floor",
  houseType: "floor",
  roomLayer: "floor",
  unlockLevel: 26,
  rarity: "common",
  colourName: "Purple",
  colour: "#8E6BEA",
  drawInRoom({ fill, width, height, groundTop }) {
    fill(0, groundTop - 2, width, 2, "#FFFFFF");
    fill(0, groundTop, width, height - groundTop, "#8E6BEA");
    for (let x = 1; x < width; x += 3) fill(x, groundTop + 1 + ((x * 5) % Math.max(2, height - groundTop - 1)), 1, 1, "#5B3FB8");
    for (let x = 2; x < width; x += 5) fill(x, groundTop + 2 + ((x * 3) % Math.max(2, height - groundTop - 2)), 1, 1, "#DCCDF5");
  }
};
