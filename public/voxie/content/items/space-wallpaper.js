export default {
  id: "space-wallpaper",
  label: "Space mural",
  category: "house",
  slot: "house-wall",
  houseType: "wallpaper",
  roomLayer: "wall",
  unlockLevel: 96,
  rarity: "ultra",
  colourName: "Galaxy",
  colour: "#2A1C5E",
  drawInRoom({ fill, disc, width, groundTop }) {
    fill(0, 0, width, groundTop, "#160F38");
    fill(0, groundTop * 0.35, width, groundTop * 0.3, "#24185A");
    for (let x = 1; x < width; x += 5) fill(x, (x * 13) % Math.max(4, groundTop - 6), 1, 1, x % 3 ? "#FFFFFF" : "#8FE9FF");
    disc(Math.round(width * 0.82), Math.round(groundTop * 0.3), 5, "#E8833A"); fill(width * 0.82 - 8, groundTop * 0.3, 17, 1, "#F6D44A");
    disc(Math.round(width * 0.45), Math.round(groundTop * 0.18), 2, "#7FD8F5");
    fill(0, groundTop - 3, width, 3, "#0E0A26");
  }
};
