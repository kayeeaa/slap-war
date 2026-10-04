export default {
  id: "3d-glasses",
  label: "3D glasses",
  category: "clothes",
  slot: "face",
  unlockLevel: 94,
  rarity: "common",
  abilities: { advanced: "think-again" },
  colourName: "White",
  colour: "#F3F6F9",
  drawOnPet(pet) {
    const { top, leftX, rightX } = pet.eyes;
    pet.block(leftX - 0.75, top - 0.5, "#F3F6F9", rightX - leftX + 2.5, 3);
    pet.block(leftX - 0.25, top, "#E8574A", 1.5, 2); pet.block(rightX - 0.25, top, "#38C9E8", 1.5, 2);
  }
};
