export default {
  id: "pixel-arena", label: "Pixel Arena", unlockLevel: 15,
  drawScene({ fill, width, height, groundTop }) {
    // Night sky in bands, with stars
    fill(0, 0, width, height, "#2A1C5E");
    fill(0, 0, width, height * 0.25, "#160F38");
    fill(0, height * 0.25, width, height * 0.2, "#1F1648");
    for (let star = 0; star < width; star += 7) fill(star, (star * 13) % Math.max(4, Math.round(height * 0.4)), 1, 1, star % 3 ? "#FFFFFF" : "#8FE9FF");
    // Blocky skyline with lit windows
    const towers = [[0.02, 0.36, 0.1], [0.13, 0.26, 0.08], [0.24, 0.42, 0.09], [0.62, 0.3, 0.1], [0.74, 0.4, 0.08], [0.85, 0.22, 0.13]];
    towers.forEach(([left, top, towerWidth], index) => {
      const x = Math.round(width * left), y = Math.round(height * top), w = Math.max(5, Math.round(width * towerWidth));
      fill(x, y, w, groundTop - y, index % 2 ? "#251A55" : "#2E2068");
      for (let row = y + 2; row < groundTop - 2; row += 3) for (let col = x + 1; col < x + w - 1; col += 2)
        if ((row * 7 + col * 3 + index) % 5 === 0) fill(col, row, 1, 1, (row + col) % 2 ? "#5CF2FF" : "#FF4FD8");
    });
    // Floating stone platforms with gems
    [[0.33, 0.22, 0.14], [0.5, 0.12, 0.1]].forEach(([left, top, platformWidth]) => {
      const x = Math.round(width * left), y = Math.round(height * top), w = Math.round(width * platformWidth);
      fill(x, y, w, 3, "#6B6F86"); fill(x, y, w, 1, "#9EA3BC"); fill(x + 1, y + 3, w - 2, 1, "#4A4D63");
      fill(x + Math.round(w / 2) - 1, y - 3, 2, 2, "#F6D44A"); fill(x + Math.round(w / 2) - 1, y - 3, 1, 1, "#FFF3B0");
    });
    fill(Math.round(width * 0.9), Math.round(height * 0.55), 2, 2, "#5CF2FF");
    fill(Math.round(width * 0.07), Math.round(height * 0.6), 2, 2, "#FF4FD8");
    // Neon grid floor
    fill(0, groundTop, width, height - groundTop, "#140C30");
    fill(0, groundTop, width, 1, "#FF4FD8");
    for (let y = groundTop + 3, gap = 3; y < height; y += gap, gap++) fill(0, y, width, 1, "#5B2BD1");
    const middle = width / 2;
    for (let lane = -8; lane <= 8; lane++) {
      for (let y = groundTop + 1; y < height; y++) {
        const spread = (y - groundTop) / Math.max(1, height - groundTop);
        fill(Math.round(middle + lane * (4 + spread * 10)), y, 1, 1, "#5B2BD1");
      }
    }
  }
};
