export default {
  id: "wallpaper-stripes-orange",
  label: "Orange stripy wallpaper",
  category: "house",
  slot: "house-wall",
  houseType: "wallpaper",
  roomLayer: "wall",
  unlockLevel: 71,
  rarity: "common",
  colourName: "Orange",
  colour: "#F28C28",
  drawInRoom({ fill, width, groundTop }) {
    fill(0, 0, width, groundTop, "#F9D3A8");
    for (let x = 1; x < width; x += 8) fill(x, 0, 3, groundTop, "#F28C28");
    fill(0, groundTop - 3, width, 3, "#C46A12"); fill(0, groundTop - 3, width, 1, "#8E4A0A");
  }
};
