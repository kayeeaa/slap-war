export default {
  id: "bow-tie", abilities: { advanced: "hint" }, label: "Bow tie", category: "clothes", slot: "neck", unlockLevel: 9, rarity: "common", colourName: "Blue", colour: "#3E6FD8",
  drawOnPet(pet) {
    const centre = pet.neck.centre, row = pet.neckRow;
    pet.block(centre - 2.5, row - 0.3, "#3E6FD8", 2, 1.6); pet.block(centre + 0.5, row - 0.3, "#3E6FD8", 2, 1.6); pet.block(centre - 0.5, row, "#2A4F9E");
  }
};
