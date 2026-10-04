export default {
  id: "wood-panels",
  label: "Wood panels",
  category: "house",
  slot: "house-wall",
  houseType: "wallpaper",
  roomLayer: "wall",
  xpPrice: 25,
  rarity: "common",
  colourName: "Wood brown",
  colour: "#A9774A",
  drawInRoom({ fill, width, groundTop }) {
    fill(0, 0, width, groundTop, "#A9774A");
    for (let x = 0; x < width; x += 7) { fill(x, 0, 1, groundTop, "#8A5E36"); fill(x + 3, (x * 3) % groundTop, 1, 2, "#97683D"); }
    fill(0, groundTop - 3, width, 3, "#6E4A2B");
  }
};
