export default {
  id: "starry-wallpaper",
  label: "Starry wallpaper",
  category: "house",
  slot: "house-wall",
  houseType: "wallpaper",
  roomLayer: "wall",
  unlockLevel: 47,
  rarity: "rare",
  colourName: "Navy",
  colour: "#22285A",
  drawInRoom({ fill, width, groundTop }) {
    fill(0, 0, width, groundTop, "#22285A");
    for (let x = 2; x < width; x += 9) for (let y = 3 + (x % 5); y < groundTop - 4; y += 11) {
      fill(x, y, 1, 1, "#F6D44A"); if ((x + y) % 3 === 0) { fill(x - 1, y, 3, 1, "#F6D44A"); fill(x, y - 1, 1, 3, "#F6D44A"); }
    }
    fill(0, groundTop - 3, width, 3, "#161A40");
  }
};
