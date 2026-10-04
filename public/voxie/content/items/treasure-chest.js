export default {
  id: "treasure-chest", label: "Treasure chest", category: "house", houseType: "furniture", slot: "house-chest", floorPosition: 0.82, unlockLevel: 17, rarity: "ultra", colourName: "Wood brown", colour: "#8A5E36",
  drawOnFloor({ fill }, x, groundY) {
    fill(x, groundY - 6, 8, 6, "#8A5E36"); fill(x, groundY - 7, 8, 2, "#A9774A");
    fill(x, groundY - 5, 8, 1, "#E9B92F"); fill(x + 3, groundY - 5, 2, 2, "#E9B92F"); fill(x + 1, groundY - 8, 6, 1, "#A9774A");
  }
};
