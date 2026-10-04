export default {
  id: "bed",
  label: "Comfy bed",
  category: "house",
  slot: "house-bed",
  houseType: "furniture",
  roomLayer: "on-floor",
  unlockLevel: 53,
  rarity: "common",
  colourName: "Blue",
  colour: "#3E6FD8",
  drawInRoom({ fill, width, height, groundTop }) {
    const x = width * 0.02, w = Math.max(18, width * 0.26), bedTop = groundTop - height * 0.1;
    fill(x, groundTop - height * 0.24, 2, height * 0.24, "#6E4A2B");
    fill(x + 2, bedTop, w - 2, groundTop - bedTop, "#8A5E36");
    fill(x + 2, bedTop - 3, w - 2, 4, "#3E6FD8"); fill(x + 2, bedTop - 3, w - 2, 1, "#6A93E8");
    fill(x + 3, bedTop - 6, 7, 3, "#FFFFFF");
  }
};
