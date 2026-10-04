export default {
  id: "spade", abilities: { master: "treasure-finder" }, label: "Tiny spade", category: "tools", slot: "hand", unlockLevel: 6, rarity: "common", colourName: "Steel blue", colour: "#9FB3C2",
  drawOnPet(pet) { pet.block(14, 6, "#8A5E36", 1, 4); pet.block(13.5, 10, "#9FB3C2", 2, 2); }
};
