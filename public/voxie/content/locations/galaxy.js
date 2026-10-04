export default {
  id: "galaxy", label: "Galaxy", unlockLevel: 100,
  drawScene({ fill, disc, width, height, groundTop }) {
    fill(0, 0, width, height, "#0E0A26");
    for (let band = 0; band < 6; band++) fill(0, height * (0.15 + band * 0.07), width, height * 0.05, ["#1E1450", "#2E1A68", "#4A1E78", "#2E1A68", "#1E1450", "#160F38"][band]);
    for (let x = 1; x < width; x += 3) fill(x, (x * 19) % Math.round(groundTop), 1, 1, x % 4 ? "#FFFFFF" : "#FF9BEA");
    disc(Math.round(width * 0.18), Math.round(height * 0.25), 6, "#E8833A"); fill(width * 0.18 - 10, height * 0.25, 21, 1, "#F6D44A");
    disc(Math.round(width * 0.8), Math.round(height * 0.35), 4, "#38D9F5"); disc(Math.round(width * 0.8) - 1, Math.round(height * 0.35) - 1, 1, "#E6FAFF");
    disc(Math.round(width * 0.55), Math.round(height * 0.12), 2, "#9B59D0");
    fill(0, groundTop, width, height - groundTop, "#24185A");
    fill(0, groundTop, width, 1, "#FF4FD8");
    for (let x = 0; x < width; x += 4) fill(x, groundTop + 2 + (x % 5), 1, 1, x % 8 ? "#5B2BD1" : "#FFFFFF");
  }
};
