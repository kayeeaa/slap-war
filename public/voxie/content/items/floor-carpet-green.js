export default {
  id: "floor-carpet-green",
  label: "Green carpet",
  category: "house",
  slot: "house-floor",
  houseType: "floor",
  roomLayer: "floor",
  unlockLevel: 99,
  rarity: "common",
  colourName: "Green",
  colour: "#5DAE4F",
  drawInRoom({ fill, width, height, groundTop }) {
    fill(0, groundTop - 2, width, 2, "#FFFFFF");
    fill(0, groundTop, width, height - groundTop, "#5DAE4F");
    for (let x = 1; x < width; x += 3) fill(x, groundTop + 1 + ((x * 5) % Math.max(2, height - groundTop - 1)), 1, 1, "#3E8A35");
    for (let x = 2; x < width; x += 5) fill(x, groundTop + 2 + ((x * 3) % Math.max(2, height - groundTop - 2)), 1, 1, "#CDEBC0");
  }
};
