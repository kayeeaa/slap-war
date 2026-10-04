export default {
  id: "headset", abilities: { advanced: "hint", master: "think-again" }, label: "Gamer headset", category: "extras", slot: "head", unlockLevel: 13, rarity: "rare", colourName: "Black", colour: "#2A2D34",
  drawOnPet(pet) {
    const cupTop = pet.eyes.top - 1, left = pet.eyes.leftX, right = pet.eyes.rightX;
    pet.block(left - 2, pet.topRow - 1, "#2A2D34", right - left + 5, 1);
    pet.block(left - 2, pet.topRow - 1, "#2A2D34", 1, cupTop - pet.topRow + 1);
    pet.block(right + 2, pet.topRow - 1, "#2A2D34", 1, cupTop - pet.topRow + 1);
    pet.block(left - 2.5, cupTop, "#3E6FD8", 1.5, 3); pet.block(right + 2, cupTop, "#3E6FD8", 1.5, 3);
  }
};
