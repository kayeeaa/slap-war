export default {
  id: "bookshelf", label: "Bookshelf", category: "house", houseType: "furniture", slot: "house-shelf", roomLayer: "on-floor", unlockLevel: 13, rarity: "rare", colourName: "Wood brown", colour: "#8A5E36",
  drawInRoom({ fill, width, height, groundTop }) {
    const shelfW = width * 0.13, shelfX = width * 0.66, shelfH = height * 0.3, shelfY = groundTop - shelfH;
    fill(shelfX, shelfY, shelfW, shelfH, "#6E4A2B"); fill(shelfX + 1, shelfY + 1, shelfW - 2, shelfH - 2, "#8A5E36");
    const bookColours = ["#E8574A", "#3E8EDB", "#F2B630", "#4CAF50", "#9B59D0"];
    for (let row = 0; row < 3; row++) {
      const shelfTop = shelfY + 1 + row * (shelfH - 2) / 3;
      fill(shelfX + 1, shelfTop + (shelfH - 2) / 3 - 1, shelfW - 2, 1, "#6E4A2B");
      for (let book = 0; book < Math.floor((shelfW - 2) / 1.5); book++) fill(shelfX + 1 + book * 1.5, shelfTop + 1, 1, (shelfH - 2) / 3 - 2, bookColours[(book + row) % 5]);
    }
  }
};
