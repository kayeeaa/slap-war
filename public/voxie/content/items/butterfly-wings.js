export default {
  id: "butterfly-wings",
  label: "Butterfly wings",
  category: "clothes",
  slot: "back",
  unlockLevel: 70,
  rarity: "rare",
  abilities: { advanced: "lucky", master: "extra-time" },
  colourName: "Rainbow",
  colour: "#9B59D0",
  drawBehindPet(pet) {
    const rows = [".PPPP.....", "PPYYPPP...", "PYYYYPPP..", "PPYYPPPPP.", ".PPPPPPPPP", "....BBBBBB", "...BBCCBBB", "...BBCCBB.", "....BBBB..", ".....BB..."];
    const colours = { P: "#9B59D0", Y: "#F6D44A", B: "#3E8EDB", C: "#7FD8F5" }, size = 0.5;
    const edges = pet.rowEdges(pet.arms.row - 1), wingWidth = rows[0].length * size, top = pet.arms.row - 1 - rows.length * size * 0.75;
    const leftStart = edges.first + 1 - wingWidth, rightStart = edges.last;
    rows.forEach((line, row) => [...line].forEach((letter, column) => {
      if (letter === ".") return;
      pet.block(leftStart + column * size, top + row * size, colours[letter], size, size);
      pet.block(rightStart + wingWidth - size - column * size, top + row * size, colours[letter], size, size);
    }));
  }
};
