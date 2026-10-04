export default {
  id: "mountains", label: "Mountains", unlockLevel: 6,
  drawScene({ fill, mountain, width, height, groundTop }) {
    fill(0, 0, width, height, "#CFE9F7");
    fill(0, 0, width, height * 0.22, "#9FD3F0");
    fill(0, height * 0.22, width, height * 0.14, "#B7DFF4");
    fill(width * 0.12, height * 0.12, 10, 2, "#FFFFFF"); fill(width * 0.15, height * 0.1, 5, 2, "#FFFFFF");
    fill(width * 0.62, height * 0.2, 8, 2, "#FFFFFF");
    mountain(width * 0.18, height * 0.3, 1.2, "#9AA9C7", true);
    mountain(width * 0.55, height * 0.18, 1.1, "#9AA9C7", true);
    mountain(width * 0.92, height * 0.32, 1.2, "#9AA9C7", true);
    mountain(width * 0.36, height * 0.42, 1.3, "#6F7FA3", false);
    mountain(width * 0.76, height * 0.46, 1.3, "#6F7FA3", false);
    fill(0, groundTop, width, height - groundTop, "#5DAE4F");
    fill(0, groundTop, width, 1, "#4A9440");
    for (let x = 3; x < width; x += 7) fill(x, groundTop + 3 + (x % 3), 1, 1, "#4A9440");
  }
};
