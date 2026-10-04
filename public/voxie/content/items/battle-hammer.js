export default {
  id: "battle-hammer", abilities: { advanced: "think-again", master: "brain-boost" }, label: "Battle hammer", category: "weapons", slot: "hand", unlockLevel: 14, rarity: "ultra", colourName: "Iron grey", colour: "#8E98A3",
  drawOnPet(pet) {
    pet.block(14, 5, "#8A5E36", 1, 7);
    pet.block(12.5, 2.5, "#8E98A3", 4, 2.5); pet.block(12.5, 3.3, "#E9B92F", 4, 0.6); pet.block(12.5, 2.5, "#B8C1CA", 4, 0.4);
  }
};
