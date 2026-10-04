export default {
  id: "vr-visor",
  label: "VR visor",
  category: "clothes",
  slot: "face",
  unlockLevel: 80,
  rarity: "ultra",
  abilities: { advanced: "brain-boost", master: "think-again" },
  colourName: "Grey",
  colour: "#3A4450",
  drawOnPet(pet) {
    const { top, leftX, rightX } = pet.eyes, edges = pet.rowEdges(Math.round(top));
    pet.block(edges.first, top + 0.5, "#2A2A33", edges.last - edges.first + 1, 1);
    pet.block(leftX - 1.5, top - 0.75, "#3A4450", rightX - leftX + 4, 3.5);
    pet.block(leftX - 1, top + 0.75, "#38D9F5", rightX - leftX + 3, 0.75);
    pet.block(leftX - 1, top - 0.5, "#56606E", rightX - leftX + 3, 0.5);
  }
};
