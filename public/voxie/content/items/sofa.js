export default {
  id: "sofa",
  label: "Sofa",
  category: "house",
  slot: "house-bed",
  houseType: "furniture",
  roomLayer: "on-floor",
  unlockLevel: 62,
  rarity: "common",
  colourName: "Green",
  colour: "#3E8E41",
  drawInRoom({ fill, width, height, groundTop }) {
    const x = width * 0.02, w = Math.max(18, width * 0.26), seatTop = groundTop - height * 0.09;
    fill(x, groundTop - height * 0.17, w, height * 0.08, "#3E8E41");
    fill(x, seatTop, w, groundTop - seatTop - 1, "#4CAF50"); fill(x, seatTop, w, 1, "#6CC46E");
    fill(x, groundTop - height * 0.17, 3, height * 0.16, "#2E7D32"); fill(x + w - 3, groundTop - height * 0.17, 3, height * 0.16, "#2E7D32");
    fill(x + 1, groundTop - 1, 1, 1, "#2A2A33"); fill(x + w - 2, groundTop - 1, 1, 1, "#2A2A33");
  }
};
