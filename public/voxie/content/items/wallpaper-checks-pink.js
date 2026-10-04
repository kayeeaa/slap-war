export default {
  id: "wallpaper-checks-pink",
  label: "Pink check wallpaper",
  category: "house",
  slot: "house-wall",
  houseType: "wallpaper",
  roomLayer: "wall",
  unlockLevel: 65,
  rarity: "common",
  colourName: "Pink",
  colour: "#F2669B",
  drawInRoom({ fill, width, groundTop }) {
    fill(0, 0, width, groundTop, "#F9D2E3");
    for (let x = 0; x < width; x += 8) fill(x, 0, 4, groundTop, "#F2669B");
    for (let y = 0; y < groundTop; y += 8) fill(0, y, width, 4, "#F2669B");
    for (let x = 0; x < width; x += 8) for (let y = 0; y < groundTop; y += 8) fill(x, y, 4, 4, "#C2456F");
    fill(0, groundTop - 3, width, 3, "#C2456F"); fill(0, groundTop - 3, width, 1, "#8E2E50");
  }
};
