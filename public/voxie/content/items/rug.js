export default {
  id: "rug", label: "Cosy rug", category: "house", houseType: "floor", slot: "house-rug", roomLayer: "on-floor", unlockLevel: 4, rarity: "common", colourName: "Your game colour",
  drawInRoom({ fill, width, height, groundTop, themeShade }) {
    const rugW = width * 0.5, rugX = (width - rugW) / 2, rugY = groundTop + 2, rugH = Math.max(4, height * 0.12);
    fill(rugX + 2, rugY, rugW - 4, rugH, themeShade(55, 10));
    fill(rugX, rugY + 2, rugW, rugH - 4, themeShade(55, 10));
    fill(rugX + 4, rugY + 2, rugW - 8, rugH - 4, themeShade(68, 10));
  }
};
