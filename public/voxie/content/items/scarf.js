export default {
  id: "scarf", abilities: { advanced: "streak-shield" }, label: "Cosy scarf", category: "clothes", slot: "neck", unlockLevel: 11, rarity: "common", colourName: "Red", colour: "#D94A3C",
  drawOnPet(pet) {
    const { first, last, centre } = pet.neck, row = pet.neckRow;
    pet.block(first, row, "#D94A3C", last - first + 1); pet.block(first, row, "#F2B630", 1); pet.block(centre + 1, row + 1, "#D94A3C", 1, 2);
  }
};
