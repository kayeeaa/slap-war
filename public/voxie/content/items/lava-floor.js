export default {
  id: "lava-floor",
  label: "Lava floor (it's fake!)",
  category: "house",
  slot: "house-floor",
  houseType: "floor",
  roomLayer: "floor",
  chanceOnly: true,
  rarity: "insane",
  chanceWithinRarity: 0.5,
  colourName: "Lava orange",
  colour: "#F28C28",
  drawInRoom({ fill, width, height, groundTop }) {
    fill(0, groundTop, width, height - groundTop, "#D93A3A");
    for (let y = groundTop + 1; y < height; y += 2) for (let x = (y * 3) % 7; x < width; x += 7) fill(x, y, 3, 1, "#F28C28");
    for (let x = 4; x < width; x += 11) fill(x, groundTop + 2 + (x % 3), 2, 1, "#FFE08A");
    fill(0, groundTop - 1, width, 1, "#2A2A33");
  }
};
