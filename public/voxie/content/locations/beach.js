export default {
  id: "beach", label: "Beach", unlockLevel: 9,
  drawScene({ fill, disc, width, height, groundTop }) {
    fill(0, 0, width, height, "#C6E8F8");
    fill(0, 0, width, height * 0.2, "#8FD0F2");
    fill(0, height * 0.2, width, height * 0.16, "#A9DBF5");
    disc(Math.round(width * 0.82), Math.round(height * 0.16), 5, "#FFD34D");
    const seaTop = Math.round(height * 0.52);
    fill(0, seaTop, width, groundTop - seaTop, "#3E9FD6");
    for (let y = seaTop + 2; y < groundTop - 1; y += 3) for (let x = (y * 5) % 9; x < width; x += 9) fill(x, y, 4, 1, "#7CC4EA");
    fill(0, groundTop - 1, width, 1, "#E9F6FB");
    fill(0, groundTop, width, height - groundTop, "#EBD39A");
    for (let x = 2; x < width; x += 5) fill(x, groundTop + 2 + (x % 4), 1, 1, "#D9BC78");
    fill(width * 0.12, groundTop + 4, 3, 2, "#F2A7C3");
  }
};
