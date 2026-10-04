export default {
  id: "wall-clock",
  label: "Wall clock",
  category: "house",
  slot: "house-wall-top",
  houseType: "extras",
  roomLayer: "on-wall",
  xpPrice: 12,
  rarity: "common",
  colourName: "White",
  colour: "#FFFFFF",
  drawInRoom({ fill, disc, width, height }) {
    const centreX = Math.round(width * 0.5), centreY = Math.round(height * 0.13);
    disc(centreX, centreY, 5, "#2A2A33"); disc(centreX, centreY, 4, "#FFFFFF");
    fill(centreX, centreY - 3, 1, 3, "#2A2A33"); fill(centreX, centreY, 3, 1, "#D93A3A");
  }
};
