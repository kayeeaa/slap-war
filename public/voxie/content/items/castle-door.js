export default {
  id: "castle-door",
  label: "Castle door",
  category: "house",
  slot: "house-door",
  houseType: "windows",
  roomLayer: "on-wall",
  unlockLevel: 87,
  rarity: "rare",
  colourName: "Dark wood",
  colour: "#5E3F22",
  drawInRoom({ fill, disc, width, height, groundTop }) {
    const doorW = Math.max(8, width * 0.13), doorX = width - doorW - 2, doorH = height * 0.48, doorY = groundTop - doorH;
    disc(Math.round(doorX + doorW / 2), Math.round(doorY + doorW / 2), Math.round(doorW / 2) + 1, "#8E9AA6");
    fill(doorX - 1, doorY + doorW / 2, doorW + 2, doorH - doorW / 2, "#8E9AA6");
    disc(Math.round(doorX + doorW / 2), Math.round(doorY + doorW / 2), Math.round(doorW / 2), "#5E3F22");
    fill(doorX, doorY + doorW / 2, doorW, doorH - doorW / 2, "#5E3F22");
    for (let x = doorX + 2; x < doorX + doorW - 1; x += 3) fill(x, doorY + 2, 1, doorH - 2, "#4A3020");
    fill(doorX, doorY + doorH * 0.35, doorW, 1, "#2A2A33"); fill(doorX, doorY + doorH * 0.75, doorW, 1, "#2A2A33");
    fill(doorX + doorW - 3, doorY + doorH * 0.55, 1, 2, "#E9B92F");
  }
};
