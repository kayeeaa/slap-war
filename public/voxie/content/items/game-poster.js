export default {
  id: "game-poster",
  label: "Game poster",
  category: "house",
  slot: "house-picture",
  houseType: "extras",
  roomLayer: "on-wall",
  xpPrice: 10,
  rarity: "common",
  colourName: "Purple",
  colour: "#5B3FB8",
  drawInRoom({ fill, width, height }) {
    const x = width * 0.68, y = height * 0.12, w = width * 0.16, h = height * 0.3;
    fill(x, y, w, h, "#5B3FB8"); fill(x + 1, y + 1, w - 2, h * 0.3, "#FF4FD8");
    fill(x + w / 2 - 2, y + h * 0.45, 4, 4, "#7ED957"); fill(x + w / 2 - 1, y + h * 0.45 + 1, 1, 1, "#14172E"); fill(x + w / 2 + 1, y + h * 0.45 + 1, 1, 1, "#14172E");
    fill(x + 2, y + h - 3, w - 4, 1, "#F6D44A");
  }
};
