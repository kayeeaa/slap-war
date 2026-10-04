export default {
  id: "pixel-sword", abilities: { advanced: "extra-time", master: "brain-boost" }, label: "Pixel sword", category: "weapons", slot: "hand", unlockLevel: 3, rarity: "common", colourName: "Silver", colour: "#C9D2DA",
  drawOnPet(pet) {
    pet.block(14, 2, "#E8EEF3", 1, 7); pet.block(14.5, 2, "#B9C4CE", 0.5, 7); pet.block(14.25, 1.5, "#E8EEF3", 0.5, 0.5);
    pet.block(13, 9, "#E9B92F", 3, 1); pet.block(14, 10, "#6E4A2B", 1, 1.5); pet.block(14, 11.5, "#E9B92F", 1, 0.5);
  }
};
