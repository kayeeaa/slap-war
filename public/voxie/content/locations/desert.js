export default {
  id: "desert", label: "Desert", unlockLevel: 26,
  drawScene({ fill, disc, width, height, groundTop }) {
    fill(0, 0, width, height, "#FBE7B8");
    fill(0, 0, width, height * 0.3, "#F8D48A");
    disc(Math.round(width * 0.78), Math.round(height * 0.18), 6, "#FFB84D"); disc(Math.round(width * 0.78), Math.round(height * 0.18), 4, "#FFE08A");
    for (let y = Math.round(height * 0.45); y < groundTop; y++) {
      const spread = (y - height * 0.45);
      fill(width * 0.32 - spread, y, spread * 2, 1, "#D9A95C");
    }
    for (let y = Math.round(height * 0.5); y < groundTop; y += 2) fill(width * 0.32 - (y - height * 0.45) + 1, y, (y - height * 0.45) * 2 - 2, 1, "#C9974A");
    fill(0, groundTop - 4, width, 4, "#EBC27A");
    fill(0, groundTop, width, height - groundTop, "#EBC27A");
    for (let x = 2; x < width; x += 7) fill(x, groundTop + 2 + (x % 5), 3, 1, "#D9A95C");
    const cactus = x => { fill(x, groundTop - 12, 3, 12, "#4E9A4A"); fill(x - 3, groundTop - 8, 3, 2, "#4E9A4A"); fill(x - 3, groundTop - 11, 2, 3, "#4E9A4A");
      fill(x + 3, groundTop - 6, 3, 2, "#4E9A4A"); fill(x + 4, groundTop - 9, 2, 3, "#4E9A4A"); fill(x + 1, groundTop - 12, 1, 12, "#6CC24A"); };
    cactus(Math.round(width * 0.08)); cactus(Math.round(width * 0.88));
  }
};
