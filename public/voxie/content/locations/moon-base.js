export default {
  id: "moon-base", label: "Moon Base", unlockLevel: 60,
  drawScene({ fill, disc, width, height, groundTop }) {
    fill(0, 0, width, height, "#0B0D1E");
    for (let x = 1; x < width; x += 4) fill(x, (x * 17) % Math.round(groundTop - 4), 1, 1, x % 3 ? "#FFFFFF" : "#8FB8FF");
    disc(Math.round(width * 0.82), Math.round(height * 0.22), 7, "#3E8EDB");
    fill(width * 0.82 - 4, height * 0.22 - 3, 4, 3, "#4CAF50"); fill(width * 0.82 + 1, height * 0.22 + 1, 3, 3, "#4CAF50"); fill(width * 0.82 - 2, height * 0.22 - 6, 5, 1, "#FFFFFF");
    const domeX = Math.round(width * 0.22), domeY = groundTop;
    disc(domeX, domeY, 9, "#BFD3E6"); disc(domeX, domeY, 8, "#7FA7CC"); fill(domeX - 4, domeY - 6, 2, 1, "#E6FAFF");
    fill(domeX + 9, groundTop - 14, 1, 14, "#AEB8C2"); fill(domeX + 10, groundTop - 14, 4, 3, "#E8574A");
    fill(0, groundTop, width, height - groundTop, "#9A9AA8");
    fill(0, groundTop, width, 1, "#C4C4D0");
    const crater = (x, y, w) => { fill(x, y, w, 2, "#7E7E8C"); fill(x + 1, y, w - 2, 1, "#6A6A78"); };
    crater(width * 0.5, groundTop + 3, 8); crater(width * 0.75, groundTop + 6, 6); crater(width * 0.1, groundTop + 7, 5);
  }
};
