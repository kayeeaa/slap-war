export default {
  id: "floor-tiles-red",
  label: "Red tiles",
  category: "house",
  slot: "house-floor",
  houseType: "floor",
  roomLayer: "floor",
  unlockLevel: 35,
  rarity: "common",
  colourName: "Red",
  colour: "#E8574A",
  drawInRoom({ fill, width, height, groundTop }) {
    fill(0, groundTop - 2, width, 2, "#FFFFFF");
    fill(0, groundTop, width, height - groundTop, "#E8574A");
    for (let y = groundTop; y < height; y += 4) fill(0, y, width, 1, "#F4C2BC");
    for (let y = groundTop, row = 0; y < height; y += 4, row++) for (let x = row % 2 ? 3 : 0; x < width; x += 6) fill(x, y, 1, 4, "#F4C2BC");
  }
};
