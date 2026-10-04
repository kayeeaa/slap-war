export default {
  id: "bat-wings",
  label: "Bat wings",
  category: "clothes",
  slot: "back",
  unlockLevel: 88,
  rarity: "ultra",
  abilities: { advanced: "think-again", master: "daring" },
  colourName: "Dark purple",
  colour: "#4A2E6E",
  drawBehindPet(pet) {
    const rows = ["K.........", "KK........", "KKK.......", "KPKK......", "KPPKKK....", "KPPPPKKKKK", "KKPPPPPPKK", "K.KKPPPKKK", "...K.KK.KK", "......K..K"];
    const colours = { K: "#3A2255", P: "#7E58A8" }, size = 0.5;
    const edges = pet.rowEdges(pet.arms.row - 1), wingWidth = rows[0].length * size, top = pet.arms.row - 1 - rows.length * size * 0.75;
    const leftStart = edges.first + 1 - wingWidth, rightStart = edges.last;
    rows.forEach((line, row) => [...line].forEach((letter, column) => {
      if (letter === ".") return;
      pet.block(leftStart + column * size, top + row * size, colours[letter], size, size);
      pet.block(rightStart + wingWidth - size - column * size, top + row * size, colours[letter], size, size);
    }));
  }
};
