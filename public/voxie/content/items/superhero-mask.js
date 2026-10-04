export default {
  id: "superhero-mask",
  label: "Hero mask",
  category: "clothes",
  slot: "face",
  xpPrice: 28,
  rarity: "rare",
  abilities: { advanced: "daring", master: "bonus-mission" },
  colourName: "Blue",
  colour: "#2A4F9E",
  drawOnPet(pet) {
    const { top, leftX, rightX } = pet.eyes;
    pet.block(leftX - 1.75, top - 0.5, "#2A4F9E", rightX - leftX + 4.5, 3);
    pet.block(leftX - 2.5, top + 0.5, "#2A4F9E", 1, 1); pet.block(rightX + 2.5, top + 0.5, "#2A4F9E", 1, 1);
    [leftX, rightX].forEach(x => { pet.block(x - 0.25, top - 0.25, "#FFFFFF", 1.5, 2.5); pet.block(x + 0.25, top + 0.25, "#1E1E22", 0.75, 1.5); });
  }
};
