export default {
  id: "floor-tiles-orange",
  label: "Orange tiles",
  category: "house",
  slot: "house-floor",
  houseType: "floor",
  roomLayer: "floor",
  unlockLevel: 96,
  rarity: "common",
  colourName: "Orange",
  colour: "#F28C28",
  drawInRoom({ fill, width, height, groundTop }) {
    fill(0, groundTop - 2, width, 2, "#FFFFFF");
    fill(0, groundTop, width, height - groundTop, "#F28C28");
    for (let y = groundTop; y < height; y += 4) fill(0, y, width, 1, "#F9D3A8");
    for (let y = groundTop, row = 0; y < height; y += 4, row++) for (let x = row % 2 ? 3 : 0; x < width; x += 6) fill(x, y, 1, 4, "#F9D3A8");
  }
};
