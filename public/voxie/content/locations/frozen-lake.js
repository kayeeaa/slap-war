export default {
  id: "frozen-lake", label: "Frozen Lake", unlockLevel: 32,
  drawScene({ fill, mountain, width, height, groundTop }) {
    fill(0, 0, width, height, "#DCEBF7");
    fill(0, 0, width, height * 0.25, "#C3DCF0");
    mountain(width * 0.25, height * 0.2, 1.2, "#B8C8DC", true);
    mountain(width * 0.7, height * 0.12, 1.1, "#A7B9D0", true);
    const pine = (x, size) => { fill(x, groundTop - 2, 1, 2, "#5E3F22");
      for (let y = 0; y < size; y++) fill(x - Math.floor(y / 2), groundTop - 2 - size + y, Math.floor(y / 2) * 2 + 1, 1, y % 3 === 0 ? "#FFFFFF" : "#2E6B4A"); };
    for (let x = 3; x < width; x += 13) pine(x, 9 + (x % 4));
    fill(0, groundTop, width, height - groundTop, "#F3F8FC");
    fill(width * 0.2, groundTop + 3, width * 0.6, height - groundTop - 4, "#A9D6F0");
    fill(width * 0.2 + 2, groundTop + 4, width * 0.15, 1, "#E6FAFF"); fill(width * 0.55, groundTop + 6, width * 0.12, 1, "#E6FAFF");
    for (let x = 1; x < width; x += 6) for (let y = (x * 7) % 9; y < groundTop; y += 9) fill(x, y, 1, 1, "#FFFFFF");
  }
};
