export default {
  id: "pickaxe", abilities: { advanced: "lucky", master: "treasure-finder" }, label: "Pickaxe", category: "tools", slot: "hand", unlockLevel: 8, rarity: "rare", colourName: "Grey", colour: "#9AA3AD",
  drawOnPet(pet) {
    pet.block(14, 5, "#8A5E36", 1, 7);
    pet.block(12.5, 4, "#9AA3AD", 4, 1); pet.block(12, 5, "#9AA3AD", 1, 1); pet.block(15.5, 5, "#9AA3AD", 1, 1);
    pet.block(13.5, 4, "#C3CAD2", 2, 0.5);
  }
};
