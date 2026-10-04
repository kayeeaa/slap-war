export default {
  id: "balloon", abilities: { advanced: "daring" }, label: "Balloon", category: "extras", slot: "float", unlockLevel: 7, rarity: "common", colourName: "Red", colour: "#E8574A",
  drawOnPet(pet) {
    const stringX = pet.arms.leftX - 0.3, top = pet.topRow;
    pet.block(stringX, top - 1.5, "#F3F3F3", 0.2, pet.arms.row - top + 1.5);
    pet.block(stringX - 1.4, top - 4.5, "#E8574A", 2.4, 2.6); pet.block(stringX - 1, top - 4.9, "#E8574A", 1.6, 3.4);
    pet.block(stringX - 0.9, top - 4.3, "#F7A99F", 0.5, 0.8); pet.block(stringX - 0.2, top - 1.7, "#B8332A", 0.6, 0.4);
  }
};
