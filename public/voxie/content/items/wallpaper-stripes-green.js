export default {
  id: "wallpaper-stripes-green",
  label: "Green stripy wallpaper",
  category: "house",
  slot: "house-wall",
  houseType: "wallpaper",
  roomLayer: "wall",
  unlockLevel: 31,
  rarity: "common",
  colourName: "Green",
  colour: "#5DAE4F",
  drawInRoom({ fill, width, groundTop }) {
    fill(0, 0, width, groundTop, "#CDEBC0");
    for (let x = 1; x < width; x += 8) fill(x, 0, 3, groundTop, "#5DAE4F");
    fill(0, groundTop - 3, width, 3, "#3E8A35"); fill(0, groundTop - 3, width, 1, "#2A6324");
  }
};
