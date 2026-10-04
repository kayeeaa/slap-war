export default {
  id: "floor-planks-white",
  label: "White floorboards",
  category: "house",
  slot: "house-floor",
  houseType: "floor",
  roomLayer: "floor",
  unlockLevel: 55,
  rarity: "common",
  colourName: "White",
  colour: "#E8E4DC",
  drawInRoom({ fill, width, height, groundTop }) {
    fill(0, groundTop - 2, width, 2, "#FFFFFF");
    fill(0, groundTop, width, height - groundTop, "#E8E4DC");
    for (let y = groundTop, row = 0; y < height; y += 3, row++) {
      fill(0, y, width, 1, "#C9C3B6");
      for (let x = row % 2 ? 2 : 9; x < width; x += 14) fill(x, y, 1, 3, "#C9C3B6");
      fill((row * 11) % width, y + 1, 3, 1, "#F6F3EE");
    }
  }
};
