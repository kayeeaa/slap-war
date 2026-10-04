export default {
  id: "crown", abilities: { advanced: "lucky", master: "treasure-finder" }, label: "Golden crown", category: "clothes", slot: "head", unlockLevel: 4, rarity: "rare", colourName: "Gold", colour: "#E9B92F",
  drawOnPet(pet) { pet.block(4, pet.topRow - 1, "#E9B92F", 6, 1); [0, 2.5, 5].forEach(offset => pet.block(4 + offset, pet.topRow - 2, "#E9B92F")); }
};
