export default {
  id: "floor-planks-grey",
  label: "Grey floorboards",
  category: "house",
  slot: "house-floor",
  houseType: "floor",
  roomLayer: "floor",
  unlockLevel: 67,
  rarity: "common",
  colourName: "Grey",
  colour: "#9AA3AE",
  drawInRoom({ fill, width, height, groundTop }) {
    fill(0, groundTop - 2, width, 2, "#FFFFFF");
    fill(0, groundTop, width, height - groundTop, "#9AA3AE");
    for (let y = groundTop, row = 0; y < height; y += 3, row++) {
      fill(0, y, width, 1, "#7A838E");
      for (let x = row % 2 ? 2 : 9; x < width; x += 14) fill(x, y, 1, 3, "#7A838E");
      fill((row * 11) % width, y + 1, 3, 1, "#B8C0C9");
    }
  }
};
