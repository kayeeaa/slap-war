export default {
  id: "neon-sign",
  label: "Neon GG sign",
  category: "house",
  slot: "house-wall-top",
  houseType: "extras",
  roomLayer: "on-wall",
  unlockLevel: 58,
  rarity: "rare",
  colourName: "Neon pink",
  colour: "#FF4FD8",
  drawInRoom({ fill, width, height }) {
    const x = Math.round(width * 0.42), y = Math.round(height * 0.07);
    const letterG = left => { fill(left, y, 4, 1, "#FF4FD8"); fill(left, y, 1, 6, "#FF4FD8"); fill(left, y + 5, 4, 1, "#FF4FD8"); fill(left + 3, y + 3, 1, 3, "#FF4FD8"); fill(left + 2, y + 3, 2, 1, "#FF4FD8"); };
    fill(x - 2, y - 2, 15, 10, "#2A1C5E"); letterG(x); letterG(x + 6);
  }
};
