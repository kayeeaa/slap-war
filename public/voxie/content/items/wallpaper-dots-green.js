export default {
  id: "wallpaper-dots-green",
  label: "Green polka dot wallpaper",
  category: "house",
  slot: "house-wall",
  houseType: "wallpaper",
  roomLayer: "wall",
  unlockLevel: 22,
  rarity: "common",
  colourName: "Green",
  colour: "#5DAE4F",
  drawInRoom({ fill, width, groundTop }) {
    fill(0, 0, width, groundTop, "#CDEBC0");
    for (let y = 2; y < groundTop - 4; y += 6) for (let x = (y / 6) % 2 < 1 ? 1 : 5; x < width; x += 8) fill(x, y, 2, 2, "#5DAE4F");
    fill(0, groundTop - 3, width, 3, "#3E8A35"); fill(0, groundTop - 3, width, 1, "#2A6324");
  }
};
