export default {
  id: "porthole-window",
  label: "Round window",
  category: "house",
  slot: "house-window",
  houseType: "windows",
  roomLayer: "on-wall",
  unlockLevel: 72,
  rarity: "rare",
  colourName: "Brass",
  colour: "#C9A04A",
  drawInRoom({ fill, disc, width, height }) {
    const centreX = Math.round(width * 0.2), centreY = Math.round(height * 0.3), radius = Math.max(6, Math.round(height * 0.16));
    disc(centreX, centreY, radius + 2, "#C9A04A"); disc(centreX, centreY, radius, "#7FC8EE");
    fill(centreX - radius + 2, centreY - 2, 3, 1, "#E6FAFF"); fill(centreX - radius + 3, centreY - 3, 2, 1, "#E6FAFF");
  }
};
