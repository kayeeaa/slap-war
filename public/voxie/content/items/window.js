export default {
  id: "window", label: "Window", category: "house", houseType: "windows", slot: "house-window", roomLayer: "on-wall", unlockLevel: 3, rarity: "common", colourName: "White", colour: "#FFFFFF",
  drawInRoom({ fill, width, height, themeShade }) {
    const windowX = width * 0.08, windowY = height * 0.1, windowW = width * 0.24, windowH = height * 0.4;
    fill(windowX - 3, windowY - 1, 3, windowH + 4, themeShade(58, 10));
    fill(windowX + windowW, windowY - 1, 3, windowH + 4, themeShade(58, 10));
    fill(windowX, windowY, windowW, windowH, "#FFFFFF");
    fill(windowX + 1, windowY + 1, windowW - 2, windowH - 2, "#BFE3F5");
    fill(windowX + windowW / 2 - 0.5, windowY, 1, windowH, "#FFFFFF");
    fill(windowX, windowY + windowH / 2, windowW, 1, "#FFFFFF");
  }
};
