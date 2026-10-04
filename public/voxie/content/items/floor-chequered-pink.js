export default {
  id: "floor-chequered-pink",
  label: "Pink chequered floor",
  category: "house",
  slot: "house-floor",
  houseType: "floor",
  roomLayer: "floor",
  unlockLevel: 30,
  rarity: "rare",
  colourName: "Pink",
  colour: "#F2669B",
  drawInRoom({ fill, width, height, groundTop }) {
    fill(0, groundTop - 2, width, 2, "#FFFFFF");
    fill(0, groundTop, width, height - groundTop, "#F3F6F9");
    for (let x = 0; x < width; x += 4) for (let y = groundTop; y < height; y += 3) if (((x / 4) + (y - groundTop) / 3) % 2 === 0) fill(x, y, 4, 3, "#F2669B");
  }
};
