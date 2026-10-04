export default {
  id: "floor-planks-pine",
  label: "Pine floorboards",
  category: "house",
  slot: "house-floor",
  houseType: "floor",
  roomLayer: "floor",
  unlockLevel: 43,
  rarity: "common",
  colourName: "Pine",
  colour: "#E3C49A",
  drawInRoom({ fill, width, height, groundTop }) {
    fill(0, groundTop - 2, width, 2, "#FFFFFF");
    fill(0, groundTop, width, height - groundTop, "#E3C49A");
    for (let y = groundTop, row = 0; y < height; y += 3, row++) {
      fill(0, y, width, 1, "#C9A87A");
      for (let x = row % 2 ? 2 : 9; x < width; x += 14) fill(x, y, 1, 3, "#C9A87A");
      fill((row * 11) % width, y + 1, 3, 1, "#F0D9B5");
    }
  }
};
