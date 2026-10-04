export default {
  id: "coral-reef", label: "Coral Reef", unlockLevel: 38,
  drawScene({ fill, width, height, groundTop }) {
    fill(0, 0, width, height, "#2E86C1");
    fill(0, 0, width, height * 0.2, "#4FA8DE");
    fill(0, height * 0.2, width, height * 0.25, "#3A97D2");
    for (let x = 0; x < width; x += 9) fill(x, (x * 3) % 6 + 1, 5, 1, "#8FD0F2");
    for (let x = 5; x < width; x += 13) { const y = height * 0.3 + (x * 7) % (height * 0.35); fill(x, y, 2, 2, "#BFE6FA"); fill(x + 3, y - 5, 1, 1, "#BFE6FA"); }
    fill(0, groundTop, width, height - groundTop, "#EBD39A");
    for (let x = 2; x < width; x += 5) fill(x, groundTop + 2 + (x % 4), 1, 1, "#D9BC78");
    const weed = (x, tall) => { for (let y = 0; y < tall; y++) fill(x + (Math.floor(y / 2) % 2), groundTop - y, 1, 1, "#3E9A4A"); };
    const coral = (x, colour) => { fill(x, groundTop - 7, 2, 7, colour); fill(x - 2, groundTop - 5, 2, 1, colour); fill(x - 2, groundTop - 8, 1, 3, colour); fill(x + 2, groundTop - 4, 2, 1, colour); fill(x + 3, groundTop - 7, 1, 3, colour); };
    weed(Math.round(width * 0.05), 12); weed(Math.round(width * 0.12), 8); weed(Math.round(width * 0.9), 11);
    coral(Math.round(width * 0.2), "#F2669B"); coral(Math.round(width * 0.8), "#F28C28");
    const fish = (x, y, colour) => { fill(x, y, 4, 2, colour); fill(x - 2, y - 1, 2, 4, colour); fill(x + 3, y, 1, 1, "#14172E"); };
    fish(width * 0.15, height * 0.35, "#F6D44A"); fish(width * 0.75, height * 0.25, "#F2669B"); fish(width * 0.6, height * 0.5, "#F28C28");
  }
};
