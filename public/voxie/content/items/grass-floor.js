export default {
  id: "grass-floor",
  label: "Grass carpet",
  category: "house",
  slot: "house-floor",
  houseType: "floor",
  roomLayer: "floor",
  unlockLevel: 67,
  rarity: "common",
  colourName: "Green",
  colour: "#5DAE4F",
  drawInRoom({ fill, width, height, groundTop }) {
    fill(0, groundTop, width, height - groundTop, "#5DAE4F");
    for (let x = 1; x < width; x += 3) fill(x, groundTop + ((x * 7) % Math.max(2, height - groundTop - 1)), 1, 1, "#7ED957");
    for (let x = 0; x < width; x += 2) fill(x, groundTop - 1, 1, 1, "#4A9440");
  }
};
