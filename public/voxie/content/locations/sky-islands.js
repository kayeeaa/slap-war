export default {
  id: "sky-islands", label: "Sky Islands", unlockLevel: 70,
  drawScene({ fill, width, height, groundTop }) {
    fill(0, 0, width, height, "#9FD3F0");
    fill(0, height * 0.4, width, height * 0.6, "#BFE3F5");
    const cloud = (x, y, w) => { fill(x, y, w, 3, "#FFFFFF"); fill(x + 2, y - 2, w - 5, 2, "#FFFFFF"); };
    cloud(width * 0.05, height * 0.2, 14); cloud(width * 0.7, height * 0.12, 12); cloud(width * 0.4, height * 0.62, 16);
    const island = (x, y, w) => {
      fill(x, y, w, 2, "#5DAE4F"); fill(x, y + 2, w, 2, "#8A5E36");
      for (let row = 0; row < w / 3; row++) fill(x + row * 1.5, y + 4 + row, w - row * 3, 1, row % 2 ? "#6E4A2B" : "#8A5E36");
      fill(x + w / 2, y - 6, 1, 6, "#6E4A2B"); fill(x + w / 2 - 3, y - 9, 7, 3, "#3E8E41");
    };
    island(width * 0.08, height * 0.32, 14); island(width * 0.72, height * 0.4, 16);
    fill(width * 0.72 + 2, height * 0.46, 1, groundTop - height * 0.46, "#E6FAFF");
    fill(0, groundTop, width, height - groundTop, "#5DAE4F");
    fill(0, groundTop, width, 1, "#4A9440");
    for (let x = 0; x < width; x += 6) fill(x, height - 2, 4, 2, "#FFFFFF");
  }
};
