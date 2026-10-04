export default {
  id: "wallpaper-stripes-pink",
  label: "Pink stripy wallpaper",
  category: "house",
  slot: "house-wall",
  houseType: "wallpaper",
  roomLayer: "wall",
  unlockLevel: 81,
  rarity: "common",
  colourName: "Pink",
  colour: "#F2669B",
  drawInRoom({ fill, width, groundTop }) {
    fill(0, 0, width, groundTop, "#F9D2E3");
    for (let x = 1; x < width; x += 8) fill(x, 0, 3, groundTop, "#F2669B");
    fill(0, groundTop - 3, width, 3, "#C2456F"); fill(0, groundTop - 3, width, 1, "#8E2E50");
  }
};
