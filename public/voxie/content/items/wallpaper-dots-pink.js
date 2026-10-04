export default {
  id: "wallpaper-dots-pink",
  label: "Pink polka dot wallpaper",
  category: "house",
  slot: "house-wall",
  houseType: "wallpaper",
  roomLayer: "wall",
  unlockLevel: 73,
  rarity: "common",
  colourName: "Pink",
  colour: "#F2669B",
  drawInRoom({ fill, width, groundTop }) {
    fill(0, 0, width, groundTop, "#F9D2E3");
    for (let y = 2; y < groundTop - 4; y += 6) for (let x = (y / 6) % 2 < 1 ? 1 : 5; x < width; x += 8) fill(x, y, 2, 2, "#F2669B");
    fill(0, groundTop - 3, width, 3, "#C2456F"); fill(0, groundTop - 3, width, 1, "#8E2E50");
  }
};
