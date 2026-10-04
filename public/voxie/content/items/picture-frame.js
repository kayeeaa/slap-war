export default {
  id: "picture-frame", label: "Picture", category: "house", houseType: "extras", slot: "house-picture", roomLayer: "on-wall", unlockLevel: 8, rarity: "rare", colourName: "Wood brown", colour: "#8A5E36",
  drawInRoom({ fill, width, height, themeShade }) {
    const frameX = width * 0.68, frameY = height * 0.14, frameW = width * 0.18, frameH = height * 0.24;
    fill(frameX, frameY, frameW, frameH, "#8A5E36");
    fill(frameX + 1, frameY + 1, frameW - 2, frameH - 2, themeShade(78));
    fill(frameX + 3, frameY + frameH - 5, frameW - 6, 3, themeShade(52));
  }
};
