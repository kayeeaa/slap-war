export default {
  id: "floor-planks-walnut",
  label: "Dark wood floorboards",
  category: "house",
  slot: "house-floor",
  houseType: "floor",
  roomLayer: "floor",
  unlockLevel: 32,
  rarity: "common",
  colourName: "Dark wood",
  colour: "#6E4A2B",
  drawInRoom({ fill, width, height, groundTop }) {
    fill(0, groundTop - 2, width, 2, "#FFFFFF");
    fill(0, groundTop, width, height - groundTop, "#6E4A2B");
    for (let y = groundTop, row = 0; y < height; y += 3, row++) {
      fill(0, y, width, 1, "#4A3020");
      for (let x = row % 2 ? 2 : 9; x < width; x += 14) fill(x, y, 1, 3, "#4A3020");
      fill((row * 11) % width, y + 1, 3, 1, "#8A5E36");
    }
  }
};
