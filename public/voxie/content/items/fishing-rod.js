export default {
  id: "fishing-rod", abilities: { advanced: "extra-time", master: "think-again" }, label: "Fishing rod", category: "tools", slot: "hand", unlockLevel: 16, rarity: "rare", colourName: "Wood brown", colour: "#8A5E36",
  drawOnPet(pet) {
    pet.block(14, 3, "#8A5E36", 0.5, 9); pet.block(14.3, 1.5, "#8A5E36", 0.4, 1.6);
    pet.block(15.4, 1.6, "#F3F3F3", 0.2, 6.4); pet.block(14.4, 1.5, "#F3F3F3", 1.1, 0.2);
    pet.block(15.1, 8, "#E8574A", 0.8, 0.5); pet.block(15.1, 8.5, "#FFFFFF", 0.8, 0.4);
  }
};
