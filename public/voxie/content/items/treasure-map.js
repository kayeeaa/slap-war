export default {
  id: "treasure-map",
  label: "Treasure map",
  category: "house",
  slot: "house-picture",
  houseType: "extras",
  roomLayer: "on-wall",
  chanceOnly: true,
  rarity: "rare",
  colourName: "Parchment",
  colour: "#E9D7A8",
  drawInRoom({ fill, width, height }) {
    const x = width * 0.67, y = height * 0.13, w = width * 0.19, h = height * 0.24;
    fill(x, y, w, h, "#E9D7A8"); fill(x, y, w, 1, "#C9B380"); fill(x, y + h - 1, w, 1, "#C9B380");
    for (let step = 0; step < 5; step++) fill(x + 2 + step * (w - 6) / 5, y + h * 0.7 - step * 1.2, 1, 1, "#8A5E36");
    fill(x + w - 5, y + 3, 1, 3, "#D93A3A"); fill(x + w - 6, y + 4, 3, 1, "#D93A3A");
    fill(x + 2, y + 2, 3, 2, "#5DAE4F");
  }
};
