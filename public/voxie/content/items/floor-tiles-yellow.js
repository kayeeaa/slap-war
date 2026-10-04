export default {
  id: "floor-tiles-yellow",
  label: "Yellow tiles",
  category: "house",
  slot: "house-floor",
  houseType: "floor",
  roomLayer: "floor",
  unlockLevel: 70,
  rarity: "common",
  colourName: "Yellow",
  colour: "#F6C445",
  drawInRoom({ fill, width, height, groundTop }) {
    fill(0, groundTop - 2, width, 2, "#FFFFFF");
    fill(0, groundTop, width, height - groundTop, "#F6C445");
    for (let y = groundTop; y < height; y += 4) fill(0, y, width, 1, "#FBEBB0");
    for (let y = groundTop, row = 0; y < height; y += 4, row++) for (let x = row % 2 ? 3 : 0; x < width; x += 6) fill(x, y, 1, 4, "#FBEBB0");
  }
};
