export default {
  id: "wallpaper-waves-purple",
  label: "Purple wavy wallpaper",
  category: "house",
  slot: "house-wall",
  houseType: "wallpaper",
  roomLayer: "wall",
  unlockLevel: 100,
  rarity: "rare",
  colourName: "Purple",
  colour: "#8E6BEA",
  drawInRoom({ fill, width, groundTop }) {
    fill(0, 0, width, groundTop, "#DCCDF5");
    for (let y = 2; y < groundTop - 5; y += 6) for (let x = 0; x < width; x++) fill(x, y + Math.round(Math.sin(x / 2) * 1.5), 1, 2, "#8E6BEA");
    fill(0, groundTop - 3, width, 3, "#5B3FB8"); fill(0, groundTop - 3, width, 1, "#3E2A85");
  }
};
