export default {
  id: "wallpaper-checks-orange",
  label: "Orange check wallpaper",
  category: "house",
  slot: "house-wall",
  houseType: "wallpaper",
  roomLayer: "wall",
  unlockLevel: 54,
  rarity: "common",
  colourName: "Orange",
  colour: "#F28C28",
  drawInRoom({ fill, width, groundTop }) {
    fill(0, 0, width, groundTop, "#F9D3A8");
    for (let x = 0; x < width; x += 8) fill(x, 0, 4, groundTop, "#F28C28");
    for (let y = 0; y < groundTop; y += 8) fill(0, y, width, 4, "#F28C28");
    for (let x = 0; x < width; x += 8) for (let y = 0; y < groundTop; y += 8) fill(x, y, 4, 4, "#C46A12");
    fill(0, groundTop - 3, width, 3, "#C46A12"); fill(0, groundTop - 3, width, 1, "#8E4A0A");
  }
};
