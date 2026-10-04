export default {
  id: "floor-tiles-green",
  label: "Green tiles",
  category: "house",
  slot: "house-floor",
  houseType: "floor",
  roomLayer: "floor",
  unlockLevel: 47,
  rarity: "common",
  colourName: "Green",
  colour: "#5DAE4F",
  drawInRoom({ fill, width, height, groundTop }) {
    fill(0, groundTop - 2, width, 2, "#FFFFFF");
    fill(0, groundTop, width, height - groundTop, "#5DAE4F");
    for (let y = groundTop; y < height; y += 4) fill(0, y, width, 1, "#CDEBC0");
    for (let y = groundTop, row = 0; y < height; y += 4, row++) for (let x = row % 2 ? 3 : 0; x < width; x += 6) fill(x, y, 1, 4, "#CDEBC0");
  }
};
