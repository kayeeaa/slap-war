export default {
  id: "foam-blaster", abilities: { advanced: "brain-boost", master: "bonus-mission" }, label: "Foam blaster", category: "weapons", slot: "hand", unlockLevel: 12, rarity: "ultra", colourName: "Orange", colour: "#F28C28",
  drawOnPet(pet) {
    pet.block(12, 6.5, "#F28C28", 4, 1.5); pet.block(12, 6.5, "#FFB866", 4, 0.4);
    pet.block(15.6, 6.8, "#4DB8FF", 0.4, 0.9); pet.block(13, 8, "#3E6FD8", 1, 2); pet.block(14.2, 8, "#3E6FD8", 0.4, 0.8);
  }
};
