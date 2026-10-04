export default {
  id: "checker-floor",
  label: "Checkerboard floor",
  category: "house",
  slot: "house-floor",
  houseType: "floor",
  roomLayer: "floor",
  xpPrice: 20,
  rarity: "common",
  colourName: "Red",
  colour: "#D94A3C",
  drawInRoom({ fill, width, height, groundTop }) {
    fill(0, groundTop, width, height - groundTop, "#F3E6CF");
    for (let x = 0; x < width; x += 4) for (let y = groundTop; y < height; y += 3) if (((x / 4) + (y - groundTop) / 3) % 2 === 0) fill(x, y, 4, 3, "#D94A3C");
  }
};
