export default {
  id: "wallpaper-dots-purple",
  label: "Purple polka dot wallpaper",
  category: "house",
  slot: "house-wall",
  houseType: "wallpaper",
  roomLayer: "wall",
  unlockLevel: 53,
  rarity: "common",
  colourName: "Purple",
  colour: "#8E6BEA",
  drawInRoom({ fill, width, groundTop }) {
    fill(0, 0, width, groundTop, "#DCCDF5");
    for (let y = 2; y < groundTop - 4; y += 6) for (let x = (y / 6) % 2 < 1 ? 1 : 5; x < width; x += 8) fill(x, y, 2, 2, "#8E6BEA");
    fill(0, groundTop - 3, width, 3, "#5B3FB8"); fill(0, groundTop - 3, width, 1, "#3E2A85");
  }
};
