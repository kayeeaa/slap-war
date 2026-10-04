export default {
  id: "wallpaper-checks-purple",
  label: "Purple check wallpaper",
  category: "house",
  slot: "house-wall",
  houseType: "wallpaper",
  roomLayer: "wall",
  unlockLevel: 45,
  rarity: "common",
  colourName: "Purple",
  colour: "#8E6BEA",
  drawInRoom({ fill, width, groundTop }) {
    fill(0, 0, width, groundTop, "#DCCDF5");
    for (let x = 0; x < width; x += 8) fill(x, 0, 4, groundTop, "#8E6BEA");
    for (let y = 0; y < groundTop; y += 8) fill(0, y, width, 4, "#8E6BEA");
    for (let x = 0; x < width; x += 8) for (let y = 0; y < groundTop; y += 8) fill(x, y, 4, 4, "#5B3FB8");
    fill(0, groundTop - 3, width, 3, "#5B3FB8"); fill(0, groundTop - 3, width, 1, "#3E2A85");
  }
};
