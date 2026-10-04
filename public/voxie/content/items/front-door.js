export default {
  id: "front-door", label: "Front door", category: "house", houseType: "windows", slot: "house-door", roomLayer: "on-wall", unlockLevel: 11, rarity: "common", colourName: "Wood brown", colour: "#8A5E36",
  drawInRoom({ fill, width, height, groundTop }) {
    const doorW = Math.max(6, width * 0.11), doorX = width - doorW - 2, doorH = height * 0.44, doorY = groundTop - doorH;
    fill(doorX - 1, doorY - 1, doorW + 2, doorH + 1, "#5E3F22");
    fill(doorX, doorY, doorW, doorH, "#8A5E36");
    fill(doorX + 1, doorY + 2, doorW - 2, doorH * 0.35, "#A9774A"); fill(doorX + 1, doorY + doorH * 0.5, doorW - 2, doorH * 0.4, "#A9774A");
    fill(doorX + doorW - 2, doorY + doorH * 0.48, 1, 1, "#F2C95C");
  }
};
