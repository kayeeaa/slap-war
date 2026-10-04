export default {
  id: "bow-and-arrow", abilities: { advanced: "hint", master: "think-again" }, label: "Bow and arrow", category: "weapons", slot: "hand", unlockLevel: 10, rarity: "rare", colourName: "Wood brown", colour: "#8A5E36",
  drawOnPet(pet) {
    pet.block(14, 3, "#8A5E36", 1, 1); pet.block(15, 4, "#8A5E36", 1, 6); pet.block(14, 10, "#8A5E36", 1, 1);
    pet.block(14.4, 4, "#F3F3F3", 0.25, 6);
    pet.block(11, 6.75, "#C9D2DA", 4.5, 0.5); pet.block(15.4, 6.5, "#9AA3AD", 0.6, 1); pet.block(11, 6.4, "#E8574A", 0.8, 1.2);
  }
};
