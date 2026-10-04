export default {
  id: "wallpaper-dots-black",
  label: "Black polka dot wallpaper",
  category: "house",
  slot: "house-wall",
  houseType: "wallpaper",
  roomLayer: "wall",
  unlockLevel: 83,
  rarity: "common",
  colourName: "Black",
  colour: "#6A7182",
  drawInRoom({ fill, width, groundTop }) {
    fill(0, 0, width, groundTop, "#3A3F4B");
    for (let y = 2; y < groundTop - 4; y += 6) for (let x = (y / 6) % 2 < 1 ? 1 : 5; x < width; x += 8) fill(x, y, 2, 2, "#6A7182");
    fill(0, groundTop - 3, width, 3, "#22252D"); fill(0, groundTop - 3, width, 1, "#14161B");
  }
};
