export default {
  id: "spooky-woods", label: "Spooky Woods", unlockLevel: 80,
  drawScene({ fill, disc, width, height, groundTop }) {
    fill(0, 0, width, height, "#2E2250");
    fill(0, 0, width, height * 0.3, "#221A3E");
    disc(Math.round(width * 0.75), Math.round(height * 0.2), 7, "#F3EFD8"); disc(Math.round(width * 0.75) + 3, Math.round(height * 0.2) - 1, 6, "#2A2048");
    const bat = (x, y) => { fill(x, y, 1, 1, "#14102A"); fill(x - 2, y - 1, 2, 1, "#14102A"); fill(x + 1, y - 1, 2, 1, "#14102A"); };
    bat(width * 0.3, height * 0.15); bat(width * 0.45, height * 0.25); bat(width * 0.6, height * 0.1);
    const deadTree = (x, tall) => { fill(x, groundTop - tall, 2, tall, "#1A1430");
      fill(x - 4, groundTop - tall * 0.7, 4, 1, "#1A1430"); fill(x - 5, groundTop - tall * 0.7 - 3, 1, 3, "#1A1430");
      fill(x + 2, groundTop - tall * 0.5, 4, 1, "#1A1430"); fill(x + 5, groundTop - tall * 0.5 - 3, 1, 3, "#1A1430"); };
    deadTree(Math.round(width * 0.08), 22); deadTree(Math.round(width * 0.9), 18);
    fill(0, groundTop, width, height - groundTop, "#3A2E4A");
    fill(0, groundTop, width, 1, "#55456A");
    const pumpkin = (x) => { fill(x, groundTop + 1, 5, 4, "#F28C28"); fill(x + 2, groundTop, 1, 1, "#3E8E41"); fill(x + 1, groundTop + 2, 1, 1, "#F6D44A"); fill(x + 3, groundTop + 2, 1, 1, "#F6D44A"); };
    pumpkin(Math.round(width * 0.18)); pumpkin(Math.round(width * 0.8));
    for (let x = 0; x < width; x += 5) fill(x, groundTop - 1 - (x % 2), 3, 1, "#4A3E66");
  }
};
