export default {
  id: "potted-plant", label: "Potted plant", category: "house", houseType: "extras", slot: "house-plant", floorPosition: 0.05, unlockLevel: 2, rarity: "common", colourName: "Green", colour: "#4CAF50",
  drawOnFloor({ fill }, x, groundY) {
    fill(x, groundY - 4, 5, 4, "#B5653A"); fill(x - 1, groundY - 5, 7, 1, "#C97A48");
    fill(x + 2, groundY - 11, 1, 6, "#3E8E41"); fill(x, groundY - 9, 2, 1, "#4CAF50"); fill(x - 1, groundY - 10, 2, 1, "#4CAF50");
    fill(x + 3, groundY - 8, 2, 1, "#4CAF50"); fill(x + 4, groundY - 9, 2, 1, "#4CAF50"); fill(x + 1, groundY - 12, 3, 1, "#5BC25F");
  }
};
