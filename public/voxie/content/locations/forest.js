export default {
  id: "forest", label: "Forest", unlockLevel: 20,
  drawScene({ fill, width, height, groundTop }) {
    fill(0, 0, width, height, "#CDEBD0");
    fill(0, 0, width, height * 0.25, "#A8DDB0");
    const tree = (x, baseY, size, leaf, dark) => {
      fill(x - 1, baseY - size, 2, size, "#6E4A2B");
      for (let layer = 0; layer < 3; layer++) {
        const top = baseY - size * 1.6 + layer * size * 0.4, half = 2 + layer * size * 0.18;
        for (let y = 0; y < size * 0.5; y++) fill(x - half * (y / (size * 0.5)) - 1, top + y, half * 2 * (y / (size * 0.5)) + 2, 1, y % 3 ? leaf : dark);
      }
    };
    for (let x = 4; x < width; x += 11) tree(x, groundTop, 10, "#5FA868", "#4E9157");
    for (let x = 9; x < width; x += 17) tree(x, groundTop + 2, 16, "#3E8E41", "#2E7D32");
    fill(0, groundTop, width, height - groundTop, "#5DAE4F");
    fill(0, groundTop, width, 1, "#4A9440");
    for (let x = 3; x < width; x += 9) { fill(x, groundTop + 3 + (x % 4), 1, 1, "#F6D44A"); fill(x + 4, groundTop + 6 - (x % 3), 1, 1, "#F2A7C3"); }
    fill(width * 0.82, groundTop + 2, 4, 2, "#D94A3C"); fill(width * 0.82 + 1, groundTop + 2, 1, 1, "#FFFFFF"); fill(width * 0.82 + 1, groundTop + 4, 2, 2, "#F3E6CF");
  }
};
