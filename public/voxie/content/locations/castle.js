export default {
  id: "castle", label: "Castle", unlockLevel: 52,
  drawScene({ fill, width, height, groundTop }) {
    fill(0, 0, width, height, "#CFE9F7");
    fill(0, 0, width, height * 0.22, "#9FD3F0");
    fill(width * 0.1, height * 0.12, 10, 2, "#FFFFFF"); fill(width * 0.8, height * 0.18, 8, 2, "#FFFFFF");
    const stone = "#9AA3AE", dark = "#7A838E", wallTop = groundTop - height * 0.32;
    const left = width * 0.2, right = width * 0.8;
    fill(left, wallTop, right - left, groundTop - wallTop, stone);
    for (let x = left; x < right; x += 4) fill(x, wallTop - 2, 2, 2, stone);
    const tower = (x, w) => { fill(x, wallTop - height * 0.16, w, groundTop - wallTop + height * 0.16, stone);
      for (let cx = x; cx < x + w; cx += 3) fill(cx, wallTop - height * 0.16 - 2, 2, 2, stone);
      fill(x + w / 2 - 1, wallTop - height * 0.08, 2, 3, "#2A2A33");
      fill(x + w / 2, wallTop - height * 0.16 - 9, 1, 7, "#5E3F22"); fill(x + w / 2 + 1, wallTop - height * 0.16 - 9, 4, 3, "#D93A3A"); };
    tower(left - 4, 10); tower(right - 6, 10);
    for (let y = wallTop + 3; y < groundTop; y += 4) for (let x = left + ((y / 4) % 2 ? 0 : 2); x < right; x += 5) fill(x, y, 3, 1, dark);
    fill(width / 2 - 5, groundTop - height * 0.16, 10, height * 0.16, "#5E3F22");
    for (let x = width / 2 - 5; x < width / 2 + 5; x += 2) fill(x, groundTop - height * 0.16, 1, height * 0.16, "#2A2A33");
    fill(0, groundTop, width, height - groundTop, "#5DAE4F");
    fill(0, groundTop, width, 1, "#4A9440");
    fill(width * 0.25, groundTop + 2, width * 0.5, 2, "#7FC8EE");
  }
};
