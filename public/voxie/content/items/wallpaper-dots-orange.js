export default {
  id: "wallpaper-dots-orange",
  label: "Orange polka dot wallpaper",
  category: "house",
  slot: "house-wall",
  houseType: "wallpaper",
  roomLayer: "wall",
  unlockLevel: 63,
  rarity: "common",
  colourName: "Orange",
  colour: "#F28C28",
  drawInRoom({ fill, width, groundTop }) {
    fill(0, 0, width, groundTop, "#F9D3A8");
    for (let y = 2; y < groundTop - 4; y += 6) for (let x = (y / 6) % 2 < 1 ? 1 : 5; x < width; x += 8) fill(x, y, 2, 2, "#F28C28");
    fill(0, groundTop - 3, width, 3, "#C46A12"); fill(0, groundTop - 3, width, 1, "#8E4A0A");
  }
};
