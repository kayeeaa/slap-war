export default {
  id: "crystal-caves", label: "Crystal Caves", unlockLevel: 90,
  drawScene({ fill, width, height, groundTop }) {
    fill(0, 0, width, height, "#1E1A30");
    for (let x = 0; x < width; x += 6) { const drop = 3 + (x * 7) % 9; for (let y = 0; y < drop; y++) fill(x + y / 3, y, 6 - y / 2, 1, "#2E2846"); }
    const crystal = (x, tall, colour, light) => {
      for (let y = 0; y < tall; y++) { const w = Math.min(4, 1 + y); fill(x - w / 2, groundTop - tall + y, w, 1, colour); }
      fill(x - 0.5, groundTop - tall + 1, 1, tall - 2, light);
    };
    crystal(width * 0.08, 14, "#9B59D0", "#D8B8F5"); crystal(width * 0.15, 9, "#38D9F5", "#BFF5FF");
    crystal(width * 0.84, 16, "#38D9F5", "#BFF5FF"); crystal(width * 0.92, 10, "#F2669B", "#FBC4DA");
    crystal(width * 0.5, 6, "#9B59D0", "#D8B8F5");
    for (let x = 3; x < width; x += 11) fill(x, height * 0.3 + (x * 5) % (height * 0.3), 1, 1, x % 2 ? "#38D9F5" : "#F2669B");
    fill(0, groundTop, width, height - groundTop, "#2E2846");
    fill(0, groundTop, width, 1, "#55488A");
    for (let x = 2; x < width; x += 7) fill(x, groundTop + 3 + (x % 4), 2, 1, "#3E3560");
  }
};
