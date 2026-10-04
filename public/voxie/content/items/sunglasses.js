export default {
  id: "sunglasses",
  label: "Cool shades",
  category: "clothes",
  slot: "face",
  unlockLevel: 23,
  rarity: "rare",
  abilities: { advanced: "daring", master: "extra-time" },
  colourName: "Black",
  colour: "#1E1E22",
  drawOnPet(pet) {
    const { top, leftX, rightX } = pet.eyes;
    [leftX, rightX].forEach(x => {
      pet.block(x - 0.75, top - 0.5, "#1E1E22", 2.5, 3); pet.block(x - 0.25, top, "#2A2F3A", 1.5, 2);
      pet.block(x - 0.25, top, "#6A7A90", 0.5, 0.5);
    });
    pet.block(leftX + 1.75, top + 0.25, "#1E1E22", rightX - leftX - 2.5, 0.5);
  }
};
