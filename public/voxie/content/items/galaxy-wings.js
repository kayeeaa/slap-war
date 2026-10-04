export default {
  id: "galaxy-wings",
  label: "Galaxy wings",
  category: "clothes",
  slot: "back",
  unlockLevel: 100,
  rarity: "insane",
  abilities: { advanced: "lucky", master: "bonus-mission" },
  colourName: "Galaxy",
  colour: "#3A2A8C",
  drawBehindPet(pet) {
    const rows = ["N...........", "NN..........", "NWN.........", "NNPN........", "NPNNWN......", "NNNPNNNN....", "NWNNNPNNNNNN", "NNNPNNNWNNNN", ".NNNNWNNNPNN", "..NNPNNNNNNN", "....NNNWNNNN", "......NNNNNN"];
    const colours = { N: "#3A2A8C", P: "#E86BD8", W: "#FFFFFF" }, size = 0.5;
    const edges = pet.rowEdges(pet.arms.row - 1), wingWidth = rows[0].length * size, top = pet.arms.row - 1 - rows.length * size * 0.75;
    const leftStart = edges.first + 1 - wingWidth, rightStart = edges.last;
    rows.forEach((line, row) => [...line].forEach((letter, column) => {
      if (letter === ".") return;
      pet.block(leftStart + column * size, top + row * size, colours[letter], size, size);
      pet.block(rightStart + wingWidth - size - column * size, top + row * size, colours[letter], size, size);
    }));
  }
};
