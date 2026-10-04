export default {
  id: "wallpaper-checks-green",
  label: "Green check wallpaper",
  category: "house",
  slot: "house-wall",
  houseType: "wallpaper",
  roomLayer: "wall",
  unlockLevel: 95,
  rarity: "common",
  colourName: "Green",
  colour: "#5DAE4F",
  drawInRoom({ fill, width, groundTop }) {
    fill(0, 0, width, groundTop, "#CDEBC0");
    for (let x = 0; x < width; x += 8) fill(x, 0, 4, groundTop, "#5DAE4F");
    for (let y = 0; y < groundTop; y += 8) fill(0, y, width, 4, "#5DAE4F");
    for (let x = 0; x < width; x += 8) for (let y = 0; y < groundTop; y += 8) fill(x, y, 4, 4, "#3E8A35");
    fill(0, groundTop - 3, width, 3, "#3E8A35"); fill(0, groundTop - 3, width, 1, "#2A6324");
  }
};
