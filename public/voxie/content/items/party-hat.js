export default {
  id: "party-hat", abilities: { advanced: "bargain", master: "lucky" }, label: "Party hat", category: "clothes", slot: "head", unlockLevel: 7, rarity: "rare", colourName: "Red", colour: "#E8574A",
  drawOnPet(pet) {
    pet.block(5, pet.topRow - 1, "#E8574A", 4, 1); pet.block(6, pet.topRow - 1, "#F2B630", 1, 1); pet.block(8, pet.topRow - 1, "#F2B630", 1, 1);
    pet.block(6, pet.topRow - 2, "#E8574A", 2, 1); pet.block(6.5, pet.topRow - 3, "#FFFFFF");
  }
};
