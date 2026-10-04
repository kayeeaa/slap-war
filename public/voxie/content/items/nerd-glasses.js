export default {
  id: "nerd-glasses",
  label: "Big glasses",
  category: "clothes",
  slot: "face",
  unlockLevel: 39,
  rarity: "common",
  abilities: { advanced: "hint" },
  colourName: "Black",
  colour: "#1E1E22",
  drawOnPet(pet) {
    const { top, leftX, rightX } = pet.eyes;
    [leftX, rightX].forEach(x => {
      pet.block(x - 0.75, top - 0.5, "#1E1E22", 2.5, 0.5); pet.block(x - 0.75, top + 2, "#1E1E22", 2.5, 0.5);
      pet.block(x - 0.75, top - 0.5, "#1E1E22", 0.5, 3); pet.block(x + 1.25, top - 0.5, "#1E1E22", 0.5, 3);
    });
    pet.block(leftX + 1.75, top + 0.25, "#1E1E22", rightX - leftX - 2.5, 0.5);
  }
};
