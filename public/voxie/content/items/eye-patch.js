export default {
  id: "eye-patch",
  label: "Pirate eye patch",
  category: "clothes",
  slot: "face",
  unlockLevel: 78,
  rarity: "common",
  abilities: { advanced: "treasure-finder" },
  colourName: "Black",
  colour: "#1E1E22",
  drawOnPet(pet) {
    const { top, rightX } = pet.eyes, edges = pet.rowEdges(Math.round(top));
    pet.block(edges.first, top - 1, "#1E1E22", rightX - edges.first, 0.5);
    pet.block(rightX - 0.75, top - 0.5, "#1E1E22", 2.5, 3);
  }
};
