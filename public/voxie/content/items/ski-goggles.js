export default {
  id: "ski-goggles",
  label: "Ski goggles",
  category: "clothes",
  slot: "face",
  unlockLevel: 59,
  rarity: "rare",
  abilities: { advanced: "streak-shield", master: "lucky" },
  colourName: "Orange",
  colour: "#F28C28",
  drawOnPet(pet) {
    const { top, leftX, rightX } = pet.eyes, edges = pet.rowEdges(Math.round(top));
    pet.block(edges.first, top + 0.5, "#2A2A33", edges.last - edges.first + 1, 1);
    pet.block(leftX - 1, top - 0.5, "#E8EEF3", rightX - leftX + 3, 3);
    pet.block(leftX - 0.5, top, "#F28C28", rightX - leftX + 2, 1); pet.block(leftX - 0.5, top + 1, "#F2C95C", rightX - leftX + 2, 1);
    pet.block(leftX, top, "#FFE08A", 1, 0.5);
  }
};
