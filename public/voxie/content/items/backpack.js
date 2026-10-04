export default {
  id: "backpack", abilities: { advanced: "bargain", master: "treasure-finder" }, label: "Backpack", category: "extras", slot: "back", unlockLevel: 15, rarity: "rare", colourName: "Blue", colour: "#4C8BF5",
  drawOnPet(pet) {
    const packX = pet.rowEdges(pet.arms.row - 1).first - 1.4, row = pet.arms.row - 2;
    pet.block(packX, row, "#4C8BF5", 1.6, 3.5); pet.block(packX, row, "#2F67C9", 1.6, 0.6);
    pet.block(packX + 1.4, row, "#2F67C9", pet.neck.centre - packX - 1, 0.4);
  }
};
