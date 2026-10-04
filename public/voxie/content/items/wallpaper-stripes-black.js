export default {
  id: "wallpaper-stripes-black",
  label: "Black stripy wallpaper",
  category: "house",
  slot: "house-wall",
  houseType: "wallpaper",
  roomLayer: "wall",
  unlockLevel: 91,
  rarity: "common",
  colourName: "Black",
  colour: "#6A7182",
  drawInRoom({ fill, width, groundTop }) {
    fill(0, 0, width, groundTop, "#3A3F4B");
    for (let x = 1; x < width; x += 8) fill(x, 0, 3, groundTop, "#6A7182");
    fill(0, groundTop - 3, width, 3, "#22252D"); fill(0, groundTop - 3, width, 1, "#14161B");
  }
};
