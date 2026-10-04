export default {
  id: "dragon-wings",
  label: "Dragon wings",
  category: "clothes",
  slot: "back",
  unlockLevel: 30,
  rarity: "insane",
  abilities: { advanced: "daring", master: "bonus-mission" },
  colourName: "Green",
  colour: "#3E8E41",
  drawBehindPet(pet) {
    const rows = ["G..........", "GG.........", "GDG........", "GDDG.......", "GDDDGG.....", "GDDDDDGG...", "GDDDDDDDGGG", "GGDDDDDDGGG", ".GGDDDDDGGG", "..GGGDDGGGG", "....GGGGGGG", "......GGGGG"];
    const colours = { G: "#2E7D32", D: "#7ED957" }, size = 0.5;
    const edges = pet.rowEdges(pet.arms.row - 1), wingWidth = rows[0].length * size, top = pet.arms.row - 1 - rows.length * size * 0.75;
    const leftStart = edges.first + 1 - wingWidth, rightStart = edges.last;
    rows.forEach((line, row) => [...line].forEach((letter, column) => {
      if (letter === ".") return;
      pet.block(leftStart + column * size, top + row * size, colours[letter], size, size);
      pet.block(rightStart + wingWidth - size - column * size, top + row * size, colours[letter], size, size);
    }));
  }
};
