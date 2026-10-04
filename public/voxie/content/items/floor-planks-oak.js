export default {
  id: "floor-planks-oak",
  label: "Oak floorboards",
  category: "house",
  slot: "house-floor",
  houseType: "floor",
  roomLayer: "floor",
  unlockLevel: 21,
  rarity: "common",
  colourName: "Oak",
  colour: "#C99B6E",
  drawInRoom({ fill, width, height, groundTop }) {
    fill(0, groundTop - 2, width, 2, "#FFFFFF");
    fill(0, groundTop, width, height - groundTop, "#C99B6E");
    for (let y = groundTop, row = 0; y < height; y += 3, row++) {
      fill(0, y, width, 1, "#A9774A");
      for (let x = row % 2 ? 2 : 9; x < width; x += 14) fill(x, y, 1, 3, "#A9774A");
      fill((row * 11) % width, y + 1, 3, 1, "#D9B48A");
    }
  }
};
