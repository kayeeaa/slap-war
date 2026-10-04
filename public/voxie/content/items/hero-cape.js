export default {
  id: "hero-cape", abilities: { advanced: "daring", master: "bonus-mission" }, label: "Hero cape", category: "clothes", slot: "back", unlockLevel: 18, rarity: "insane", colourName: "Red", colour: "#C8323C",
  // The cape flares out behind the body, so part of it is drawn before the pet...
  drawBehindPet(pet) {
    for (let row = pet.neckRow; row < 12; row++) {
      const edges = pet.rowEdges(row), flare = (row - pet.neckRow) * 0.25, colour = row % 2 ? "#C8323C" : "#B02A33";
      pet.block(edges.first - 0.8 - flare, row, colour, 1 + flare, 1);
      pet.block(edges.last + 0.8, row, colour, 1 + flare, 1);
    }
  },
  // ...and the collar on top.
  drawOnPet(pet) {
    const collar = pet.rowEdges(pet.neckRow);
    pet.block(collar.first, pet.neckRow - 0.2, "#C8323C", collar.last - collar.first + 1, 0.6); pet.block(pet.neck.centre - 0.5, pet.neckRow - 0.2, "#F2B630", 1, 0.6);
  }
};
