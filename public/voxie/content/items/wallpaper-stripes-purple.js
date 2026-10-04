export default {
  id: "wallpaper-stripes-purple",
  label: "Purple stripy wallpaper",
  category: "house",
  slot: "house-wall",
  houseType: "wallpaper",
  roomLayer: "wall",
  unlockLevel: 61,
  rarity: "common",
  colourName: "Purple",
  colour: "#8E6BEA",
  drawInRoom({ fill, width, groundTop }) {
    fill(0, 0, width, groundTop, "#DCCDF5");
    for (let x = 1; x < width; x += 8) fill(x, 0, 3, groundTop, "#8E6BEA");
    fill(0, groundTop - 3, width, 3, "#5B3FB8"); fill(0, groundTop - 3, width, 1, "#3E2A85");
  }
};
