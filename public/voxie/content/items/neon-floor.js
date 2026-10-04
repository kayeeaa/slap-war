export default {
  id: "neon-floor",
  label: "Neon grid floor",
  category: "house",
  slot: "house-floor",
  houseType: "floor",
  roomLayer: "floor",
  unlockLevel: 82,
  rarity: "rare",
  colourName: "Neon pink",
  colour: "#FF4FD8",
  drawInRoom({ fill, width, height, groundTop }) {
    fill(0, groundTop, width, height - groundTop, "#140C30");
    fill(0, groundTop, width, 1, "#FF4FD8");
    for (let y = groundTop + 3; y < height; y += 3) fill(0, y, width, 1, "#5B2BD1");
    for (let x = 2; x < width; x += 6) fill(x, groundTop + 1, 1, height - groundTop, "#5B2BD1");
  }
};
