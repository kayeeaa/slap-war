export default {
  id: "moustache",
  label: "Fancy moustache",
  category: "clothes",
  slot: "mouth",
  xpPrice: 10,
  rarity: "common",
  abilities: { advanced: "bargain" },
  colourName: "Brown",
  colour: "#4A3020",
  drawOnPet(pet) {
    const x = pet.face.mouthX, row = pet.face.mouthRow - 0.75;
    pet.block(x - 1.5, row, "#4A3020", 5, 0.75); pet.block(x - 2, row - 0.5, "#4A3020", 1, 0.75); pet.block(x + 3, row - 0.5, "#4A3020", 1, 0.75);
    pet.block(x + 0.5, row - 0.25, "#4A3020", 1, 0.5);
  }
};
