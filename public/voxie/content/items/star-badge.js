export default {
  id: "star-badge", abilities: { advanced: "brain-boost" }, label: "Star badge", category: "extras", slot: "chest", unlockLevel: 6, rarity: "common", colourName: "Gold", colour: "#F2B630",
  drawOnPet(pet) {
    const x = pet.neck.centre + 1.5, row = pet.neckRow + 1;
    pet.block(x, row, "#F2B630"); pet.block(x + 0.3, row - 0.4, "#F2B630", 0.4, 1.8); pet.block(x - 0.4, row + 0.3, "#F2B630", 1.8, 0.4);
    pet.block(x + 0.3, row + 0.3, "#FFE08A", 0.4, 0.4);
  }
};
