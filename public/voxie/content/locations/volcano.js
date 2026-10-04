export default {
  id: "volcano", label: "Volcano", unlockLevel: 45,
  drawScene({ fill, width, height, groundTop }) {
    fill(0, 0, width, height, "#5A1E1E");
    fill(0, 0, width, height * 0.25, "#3A1414");
    fill(0, height * 0.25, width, height * 0.2, "#4A1A1A");
    const peakX = width * 0.55, peakY = height * 0.22;
    for (let y = Math.round(peakY); y < groundTop; y++) { const half = (y - peakY) * 1.1 + 4; fill(peakX - half, y, half * 2, 1, "#3A2E2E"); }
    fill(peakX - 4, peakY, 8, 2, "#F28C28");
    for (let y = Math.round(peakY); y < groundTop - 2; y += 1) fill(peakX - 2 + Math.round(Math.sin(y / 3) * 2), y, 2, 1, "#E8574A");
    for (let x = 1; x < width; x += 7) fill(x, (x * 11) % Math.round(height * 0.6), 1, 1, x % 2 ? "#F6D44A" : "#F28C28");
    fill(peakX - 6, peakY - 6, 3, 3, "#6B5E5E"); fill(peakX + 2, peakY - 9, 4, 3, "#6B5E5E"); fill(peakX - 1, peakY - 13, 3, 3, "#7E7070");
    fill(0, groundTop, width, height - groundTop, "#2A2222");
    fill(0, groundTop, width, 1, "#E8574A");
    for (let x = 3; x < width; x += 8) fill(x, groundTop + 3 + (x % 4), 4, 1, "#F28C28");
  }
};
